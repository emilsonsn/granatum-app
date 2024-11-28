import { Component } from '@angular/core';
import {Contact} from "@models/contact";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-web-chat-private',
  templateUrl: './web-chat-private.component.html',
  styleUrl: './web-chat-private.component.scss'
})
export class WebChatPrivateComponent {
  contact: Contact | null = null;  // Contato a ser exibido
  uuid: string = '';  // Armazena o UUID vindo da rota

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uuid = params['uuid'];  // Captura o UUID da URL
      this.loadContactByUuid(this.uuid);  // Carrega o contato correspondente
    });
  }

  // Função para carregar o contato pelo UUID
  loadContactByUuid(uuid: string): void {
    this.http.get<Contact[]>('assets/json/contacts_mock.json')  // Caminho para o arquivo JSON
      .subscribe({
        next: (data) => {
          this.contact = data.find(contact => contact.uuid === uuid) || null;  // Filtra o contato pelo UUID
          if (!this.contact) {
            console.error('Contato não encontrado');
          }
        },
        error: (err) => {
          console.error('Erro ao carregar os contatos', err);
        }
      });
  }
}
