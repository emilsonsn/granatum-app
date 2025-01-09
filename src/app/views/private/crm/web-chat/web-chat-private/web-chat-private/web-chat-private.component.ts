import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact, Message, SendMessagePayloadDto} from "@models/Whatsapp";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {WhatsappService} from "@services/crm/whatsapp.service";
import {Subscription} from "rxjs";
import {Order, PageControl} from "@models/application";
import {environment} from "@env/environment";
import {WebsocketService} from "@services/crm/websocket.service";

@Component({
  selector: 'app-web-chat-private',
  templateUrl: './web-chat-private.component.html',
  styleUrls: ['./web-chat-private.component.scss']
})
export class WebChatPrivateComponent implements OnInit, OnDestroy {
  contact: Contact | null = null;
  uuid: string = '';
  messages: Message[] = [];
  instance: string;
  private subscription: Subscription;
  groupedMessages: { [key: string]: Message[] } = {};
  loading: boolean = false;
  pageControl: PageControl = {
    take: 20,
    page: 1,
    order: Order.DESC,
  };

  constructor(
    private _route: ActivatedRoute,
    private route: Router,
    private http: HttpClient,
    private readonly _router: Router,
    private readonly whatsappService: WhatsappService,
    public websocketService: WebsocketService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.whatsappService.data$.subscribe((data) => {
      this.contact = data;
    });

    this.instance = this.getInstance();

    this.websocketService.subscribeToChannel('evolution-channel').subscribe(
      msg => {
        const remoteJid = JSON.parse(msg.data).data.remoteJid;
        if (remoteJid === this.uuid) {
          this.loadNewMessages(this.uuid);
        }
      },
      err => console.error('Erro ao receber mensagem:', err),
      () => console.log('Conexão fechada')
    );

    this._route.params.subscribe(params => {
      this.uuid = params['uuid'];
      this.messages = [];
      this.pageControl.page = 1;

      this.loadMessagesByUuid(this.uuid);
    });
  }

  private getInstance(): string {
    const url = this.route.url;
    const match = url.match(/\/painel\/([^/]+)/);
    if (match && match[1]) {
      const instance = match[1];
      const instanceKey = `instance${instance.toUpperCase()}`;
      return environment[instanceKey];
    } else {
      return null;
    }
  }

  loadNewMessages(uuid: string) {
    const pageControl: PageControl = {
      take: 1,
      page: 1,
      order: Order.DESC,
    };
    this.whatsappService.searchMessage(uuid, pageControl)
      .subscribe({
        next: (data) => {
          const newMessage = data.data[0];
          const contactIndex = this.messages.findIndex(message => message.id === newMessage.id);
          if (contactIndex === -1) {
            this.messages.push(newMessage);
          } else {
            this.messages[contactIndex] = newMessage;
          }

          this.messages = [...this.messages];
          this.groupMessagesByDay();
        },
        error: (error) => {
          console.error(error);
        }
      });

  }


  ngOnDestroy(): void {
    // Cancelar subscrição para evitar memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public _initOrStopLoading() {
    this.loading = !this.loading;
  }

  private loadMessagesByUuid(uuid: string) {
    this.whatsappService.read(this.uuid, this.instance)
      .subscribe({
        next: (data) => {
          // console.log(data);
        },
        error: (error) => {
          console.error(error);
        }
      });
    this._initOrStopLoading();
    this.whatsappService.searchMessage(uuid, this.pageControl)
      .subscribe({
        next: (data) => {
          const newMessages = data.data;

          this.pageControl.itemCount = data.total;
          this.pageControl.pageCount = data.last_page;

          const filteredMessages = newMessages.filter(newMsg =>
            !this.messages.some(existingMsg => existingMsg.id === newMsg.id)
          );

          this.messages = [...this.messages, ...filteredMessages];
          this.groupMessagesByDay();
          this._initOrStopLoading();
        },
        error: (error) => {
          console.error(error);
          this._initOrStopLoading();
        }
      });
  }

  sendMessage(messageObject: { message: string; files: File[] }): void {
    const sign = localStorage.getItem('sign') === 'true';

    const newMessage: SendMessagePayloadDto = {
      message: messageObject.message,
      number: this.contact?.remoteJid,
      sign: sign
    };

    if (messageObject.files.length > 0) {
      this.whatsappService.sendMedia({
          number: this.contact?.remoteJid,
          instance: this.instance,
          medias: messageObject.files,
          message: ""
        })
        .subscribe({
          error: (error) => {
            console.error(error);
          }
        });
    }

    if (messageObject.message) {
      this.whatsappService.sendMessage(newMessage, this.instance)
        .subscribe({
          error: (error) => {
            console.error(error);
          }
        });
    }
  }

  groupMessagesByDay(): void {
    this.groupedMessages = this.messages.reduce((acc, message) => {
      // Converte updated_at para um objeto Date, caso ainda não seja
      const dateObj = new Date(message.updated_at);

      // Formata a data para comparar apenas o dia (ano-mês-dia)
      const dateKey = dateObj.toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      // Adiciona a mensagem ao grupo do dia
      acc[dateKey].push(message);

      // Ordena as mensagens no grupo por data
      acc[dateKey].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

      return acc;
    }, {});
  }

  reachedTop($event: void) {
    const pageCount = Math.ceil(this.pageControl.itemCount / this.pageControl.take);

    if (this.pageControl.page <= pageCount) {
      this.loadMessagesByUuid(this.uuid);
    }

    this.pageControl.page += 1;
  }

  sendAudio($event: {file: File}) {
    this.whatsappService.sendAudio({
      number: this.contact?.remoteJid,
      instance: this.instance,
      audio: $event.file
    }).subscribe({
      error: (error) => {
        console.error(error);
      }
    });
  }
}
