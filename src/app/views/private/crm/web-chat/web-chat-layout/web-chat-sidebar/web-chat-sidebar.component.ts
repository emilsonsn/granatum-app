import { Component } from '@angular/core';
import {Contact, ContactStatus} from "@models/contact";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-web-chat-sidebar',
  templateUrl: './web-chat-sidebar.component.html',
  styleUrl: './web-chat-sidebar.component.scss'
})
export class WebChatSidebarComponent {
  search: string = ''; // Variável para busca no sidebar
  contacts: Contact[] = []; // Lista de contatos
  groupedContacts: { [key in ContactStatus]: Contact[] } = {
    [ContactStatus.Attending]: [],
    [ContactStatus.Waiting]: [],
    [ContactStatus.Completed]: []
  }; // Contatos agrupados por status

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadContacts(); // Carregar os contatos ao inicializar
  }

  // Função para carregar os contatos do arquivo JSON
  loadContacts(): void {
    this.http.get<Contact[]>('assets/json/contacts_mock.json')  // Caminho para o arquivo JSON no diretório assets
      .subscribe({
        next: (data) => {
          this.contacts = data;  // Atribui os dados recebidos à lista de contatos
          this.groupContactsByStatus(); // Agrupa os contatos por status
        },
        error: (err) => {
          console.error('Erro ao carregar os contatos', err);
        }
      });
  }

  // Função para agrupar os contatos por status
  groupContactsByStatus(): void {
    this.contacts.forEach(contact => {
      switch (contact.status) {
        case ContactStatus.Attending:
          this.groupedContacts[ContactStatus.Attending].push(contact);
          break;
        case ContactStatus.Waiting:
          this.groupedContacts[ContactStatus.Waiting].push(contact);
          break;
        case ContactStatus.Completed:
          this.groupedContacts[ContactStatus.Completed].push(contact);
          break;
      }
    });
  }

  protected readonly ContactStatus = ContactStatus;

  getBagdeTab(groupedContact: Contact[]) {
    return groupedContact.filter(a => a.unread).length;
  }
}
