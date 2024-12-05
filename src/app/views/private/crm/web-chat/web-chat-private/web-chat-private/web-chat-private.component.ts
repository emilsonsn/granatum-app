import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact, Message, SendMessagePayloadDto} from "@models/Whatsapp";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {WhatsappService} from "@services/crm/whatsapp.service";
import {Subscription} from "rxjs";

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
      this.loadMessagesByUuid(this.uuid);
    });
  }

  ngOnDestroy(): void {
    // Cancelar subscrição para evitar memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadMessagesByUuid(uuid: string) {
    this.whatsappService.searchMessage(uuid)
      .subscribe({
        next: (data) => {
          this.messages = data.data;
          this.groupMessagesByDay();
          console.log(this.groupedMessages);
        },
        error: (error) => {
          console.error(error);
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

}
