import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact, Message, SendMessagePayloadDto} from "@models/Whatsapp";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {WhatsappService} from "@services/crm/whatsapp.service";
import {Subscription} from "rxjs";
import {Order, PageControl} from "@models/application";

@Component({
  selector: 'app-web-chat-private',
  templateUrl: './web-chat-private.component.html',
  styleUrls: ['./web-chat-private.component.scss']
})
export class WebChatPrivateComponent implements OnInit, OnDestroy {
  contact: Contact | null = null;
  uuid: string = '';
  messages: Message[] = [];
  private subscription: Subscription;
  groupedMessages: { [key: string]: Message[] } = {};
  loading: boolean = false;
  pageControl: PageControl = {
    take: 20,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    order: Order.DESC,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private readonly _router: Router,
    private readonly whatsappService: WhatsappService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.whatsappService.data$.subscribe((data) => {
      this.contact = data; // Atualiza a variável local quando o BehaviorSubject emite um valor
    });

    this.route.params.subscribe(params => {
      this.uuid = params['uuid'];

      // Zera as variáveis para garantir que a conversa seja reiniciada
      this.messages = [];
      this.groupedMessages = {};
      this.pageControl.page = 1;  // Reinicia a paginação
      this.loadMessagesByUuid(this.uuid);  // Carrega as mensagens novamente
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
    this._initOrStopLoading();
    this.whatsappService.searchMessage(uuid, this.pageControl)
      .subscribe({
        next: (data) => {
          const newMessages = data.data;

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

  sendMessage(message: string): void {
    const newMessage: SendMessagePayloadDto = {
      message: message,
      number: this.contact?.remoteJid,
    };

    this.whatsappService.sendMessage(newMessage)
      .subscribe({
        next: (data) => {
          this.loadMessagesByUuid(this.uuid);
        },
        error: (error) => {
          console.error(error);
        }
      });

    // this.messages = [newMessage, ...this.messages];
    this.groupMessagesByDay();
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
    this.pageControl.page += 1;
    this.loadMessagesByUuid(this.uuid);
  }
}
