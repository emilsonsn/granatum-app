import { Component } from '@angular/core';
import { Contact } from "@models/contact";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Message } from "@models/message";

@Component({
  selector: 'app-web-chat-private',
  templateUrl: './web-chat-private.component.html',
  styleUrls: ['./web-chat-private.component.scss']
})
export class WebChatPrivateComponent {
  contact: Contact | null = null;
  uuid: string = '';
  messages: Message[] = [
    ...Array.from({ length: 5 }, (_, i) => {
      const currentDate = new Date();
      const messageDate = new Date(currentDate.getTime() - i * 60000);

      return {
        id: i,
        message: `${i % 2 === 0 ? 'Esta é uma mensagem do bot.' : 'Esta é uma resposta do utilizador.'} ${i}`,
        sender: i % 2 === 0 ? 'bot' : 'user',
        date: messageDate,
        phone: '555-010' + (i + 1) // Adiciona um número de telefone fictício
      };
    }),

    ...Array.from({ length: 5 }, (_, i) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const messageDate = new Date(yesterday.getTime() - i * 60000);

      return {
        id: i + 5,
        message: `${i % 2 === 0 ? 'Esta é uma mensagem do bot.' : 'Esta é uma resposta do utilizador.'} ${i + 5}`,
        sender: i % 2 === 0 ? 'bot' : 'user',
        date: messageDate,
        phone: '555-020' + (i + 1) // Adiciona um número de telefone fictício
      };
    }),

    ...Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 3);
      const messageDate = new Date(date.getTime() - i * 60000);

      return {
        id: i + 10,
        message: `${i % 2 === 0 ? 'Esta é uma mensagem do bot.' : 'Esta é uma resposta do utilizador.'} ${i + 10}`,
        sender: i % 2 === 0 ? 'bot' : 'user',
        date: messageDate,
        phone: '555-030' + (i + 1) // Adiciona um número de telefone fictício
      };
    })
  ];

  groupedMessages: { [key: string]: Message[] } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
      this.loadContactByUuid(this.uuid);
    });

    this.groupMessagesByDay();
  }

  loadContactByUuid(uuid: string): void {
    this.http.get<Contact[]>('assets/json/contacts_mock.json')
      .subscribe({
        next: (data) => {
          this.contact = data.find(contact => contact.uuid === uuid) || null;
          if (!this.contact) {
            console.error('Contato não encontrado');
          }
        },
        error: (err) => {
          console.error('Erro ao carregar os contatos', err);
        }
      });
  }

  sendMessage(message: string): void {

    const newMessage: Message = {
      id: this.messages.length,
      message: message,
      sender: 'user',
      date: new Date(),
      phone: '555-04001'
    };

    this.messages = [newMessage, ...this.messages];
    this.groupMessagesByDay();

  }

  groupMessagesByDay(): void {
    this.groupedMessages = this.messages.reduce((acc, message) => {
      // Formata a data para comparar apenas o dia (ano-mês-dia)
      const dateKey = message.date.toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      // Adiciona a mensagem ao grupo do dia
      acc[dateKey].push(message);

      // Ordena as mensagens no grupo por data
      acc[dateKey].sort((a, b) => a.date.getTime() - b.date.getTime());

      return acc;
    }, {});
  }




}
