import {Component} from '@angular/core';
import {Contact, ContactStatus} from "@models/Whatsapp";
import {HttpClient} from "@angular/common/http";
import {WhatsappService} from "@services/crm/whatsapp.service";
import {finalize} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "@env/environment";
import {WebsocketService} from "@services/crm/websocket.service";

@Component({
  selector: 'app-web-chat-sidebar',
  templateUrl: './web-chat-sidebar.component.html',
  styleUrls: ['./web-chat-sidebar.component.scss']
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
    public websocketService: WebsocketService,
  ) {
  }

  ngOnInit(): void {
    this.instance = this.getInstance();
    this.loadContacts();

    this.websocketService.subscribeToChannel('evolution-channel').subscribe(
      msg => this.loadContactRemoteJid(JSON.parse(msg.data).data.remoteJid),
      err => console.error('Erro ao receber mensagem:', err),
      () => console.log('Conexão fechada')
    );
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


  loadContactRemoteJid(remoteJid: string): void {
    this.whatsappService.searchChat({remoteJid}, this.instance).pipe(finalize(() => {
      }))
      .subscribe({
        next: res => {
          const newContact = res.data[0];

          const contactIndex = this.contacts.findIndex(contact => contact.remoteJid === newContact.remoteJid);

          if (contactIndex === -1) {
            this.contacts.push(newContact);
          } else {
            this.contacts[contactIndex] = newContact;
          }

          this.groupContactsByStatus();
        },
        error: (err) => {
          console.error('Erro ao carregar os contatos', err);
        }
      });
  }


  loadContacts(): void {
    this.whatsappService.searchChat(null, this.instance).pipe(finalize(() => {
      }))
      .subscribe({
        next: res => {
          // Usar um Set para evitar contatos duplicados
          const uniqueContacts = new Set<string>();
          this.contacts = [];

          let url = this.route.url.split("/");

          res.data.forEach(contact => {
            // Verifica se o contato já foi adicionado
            if (!uniqueContacts.has(contact.remoteJid)) {
              uniqueContacts.add(contact.remoteJid);
              this.contacts.push(contact);

              // Define o contato atual se corresponder ao URL
              if (contact.remoteJid === url[url.length - 1]) {
                this.whatsappService.setContact(contact);
              }
            }
          });

          this.groupContactsByStatus();
        },
        error: (err) => {
          console.error('Erro ao carregar os contatos', err);
        }
      });
  }

  groupContactsByStatus(): void {
    // Limpa os grupos antes de preenchê-los novamente
    Object.keys(this.groupedContacts).forEach(status => {
      this.groupedContacts[status as ContactStatus] = [];
    });

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
