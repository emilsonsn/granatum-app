import {Component, DebugElement} from '@angular/core';
import {Contact, ContactStatus} from "@models/Whatsapp";
import {HttpClient} from "@angular/common/http";
import {WhatsappService} from "@services/crm/whatsapp.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "@env/environment";

@Component({
  selector: 'app-web-chat-sidebar',
  templateUrl: './web-chat-sidebar.component.html',
  styleUrl: './web-chat-sidebar.component.scss'
})
export class WebChatSidebarComponent {
  search: string = '';
  contacts: Contact[] = [];
  instance: string;
  groupedContacts: { [key in ContactStatus]: Contact[] } = {
    [ContactStatus.Responding]: [],
    [ContactStatus.Waiting]: [],
    [ContactStatus.Finished]: []
  };

  constructor(
    private http: HttpClient,
    private readonly whatsappService: WhatsappService,
    private route: Router,
  ) {
  }

  ngOnInit(): void {
    this.instance = this.getInstance();
    this.loadContacts();
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

  loadContacts(): void {
    this.whatsappService.searchChat(null, this.instance).pipe(finalize(() => {
      }))
      .subscribe({
        next: res => {
          this.contacts = res.data;

          let url = this.route.url.split("/");

          res.data.forEach(contact => {
            if (contact.remoteJid === url[url.length - 1]) {
              this.whatsappService.setContact(contact);
            }
          });

          this.groupContactsByStatus();
        },
      });

    /*this.http.get<Contact[]>('assets/json/contacts_mock.json')
      .subscribe({
        next: (data) => {

        },
        error: (err) => {
          console.error('Erro ao carregar os contatos', err);
        }
      });*/
  }

  groupContactsByStatus(): void {
    this.contacts.forEach(contact => {
      switch (contact.status) {
        case ContactStatus.Responding:
          this.groupedContacts[ContactStatus.Responding].push(contact);
          break;
        case ContactStatus.Waiting:
          this.groupedContacts[ContactStatus.Waiting].push(contact);
          break;
        case ContactStatus.Finished:
          this.groupedContacts[ContactStatus.Finished].push(contact);
          break;
      }
    });

    // Ordenar cada grupo de contatos pelo campo 'updated_at' (do mais recente para o menos recente)
    Object.keys(this.groupedContacts).forEach(status => {
      this.groupedContacts[status as ContactStatus] = this.groupedContacts[status as ContactStatus]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    });
  }


  protected readonly ContactStatus = ContactStatus;

  getBagdeTab(groupedContact: Contact[]) {
    return groupedContact.length;
  }
}
