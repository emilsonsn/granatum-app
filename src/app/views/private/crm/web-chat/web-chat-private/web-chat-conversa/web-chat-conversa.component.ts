import { Component, Input } from '@angular/core';
import { Message } from "@models/Whatsapp";

@Component({
  selector: 'app-web-chat-conversa',
  templateUrl: './web-chat-conversa.component.html',
  styleUrls: ['./web-chat-conversa.component.scss']
})
export class WebChatConversaComponent {
  @Input() data!: { [p: string]: Message[] };

  getDateLabel(date: string | Date): string {
    // Garantir que o parâmetro date seja um objeto Date
    const parsedDate = new Date(date);

    // Verifica se a data é válida
    if (isNaN(parsedDate.getTime())) {
      return 'Data inválida';
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (parsedDate.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (parsedDate.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return parsedDate.toLocaleDateString(); // Usa a data no formato local
  }
}
