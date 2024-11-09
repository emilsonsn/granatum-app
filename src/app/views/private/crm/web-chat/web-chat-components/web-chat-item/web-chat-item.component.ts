import {Component, Input} from '@angular/core';
import {Contact, ContactStatus} from "@models/contact";
import {Router} from "@angular/router";

@Component({
  selector: 'app-web-chat-item',
  templateUrl: './web-chat-item.component.html',
  styleUrl: './web-chat-item.component.scss'
})
export class WebChatItemComponent {
  @Input() tag: boolean;
  @Input() qtdBadge: number;

  @Input() data: Contact;

  constructor(private router: Router) {
  }

  clicked(event: Event, item: Contact) {
    event.preventDefault();
    if (this.data.status === ContactStatus.Waiting) {
      return;
    }

    this.router.navigate(['painel/crm/web-chat', item.uuid]).then();
  }


  formatDate(date: string | Date | null): string {
    if (typeof date === 'string') {
      // Verificar e ajustar a string para o formato correto (adicionar 'T' entre a data e hora)
      if (date.includes(' ')) {
        date = date.replace(' ', 'T'); // Converte 'YYYY-MM-DD HH:mm:ss' para 'YYYY-MM-DDTHH:mm:ss'
      }
      date = new Date(date); // Tenta criar um objeto Date a partir da string ajustada
    }

    // Verificar se a data é válida
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Data inválida'; // Retorna mensagem de erro se a data for inválida
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Verificar se a data é de ontem
    if (date.toDateString() === yesterday.toDateString()) {
      return 'ontem';
    }

    const isToday = date.toDateString() === today.toDateString();

    // Se for hoje, retorna apenas o horário
    if (isToday) {
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${hours % 12 || 12}:${minutes} ${period}`;
    }

    // Se for outro dia, retorna apenas a data no formato DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  truncateString(value: string, length: number): string {
    if (value.length > length) {
      return value.slice(0, length) + "..."; // Trunca e adiciona "..."
    }
    return value; // Retorna a string original se o comprimento não ultrapassar o limite
  }

  protected readonly ContactStatus = ContactStatus;
}
