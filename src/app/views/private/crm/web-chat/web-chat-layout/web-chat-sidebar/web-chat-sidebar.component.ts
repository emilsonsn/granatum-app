import {Component} from '@angular/core';
import {Contact, ContactStatus} from "@models/Whatsapp";
import {HttpClient} from "@angular/common/http";
import {WhatsappService} from "@services/crm/whatsapp.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-web-chat-sidebar',
  templateUrl: './web-chat-sidebar.component.html',
  styleUrl: './web-chat-sidebar.component.scss'
})
export class WebChatSidebarComponent {
  search: string = '';
  contacts: Contact[] = [];
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
    this.loadContacts();
  }

  loadContacts(): void {

    this.whatsappService.searchChat().pipe(finalize(() => {
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
  }

  protected readonly ContactStatus = ContactStatus;

  getBagdeTab(groupedContact: Contact[]) {
    // return groupedContact.filter(a => a.unread).length;
    return 1
  }
}
