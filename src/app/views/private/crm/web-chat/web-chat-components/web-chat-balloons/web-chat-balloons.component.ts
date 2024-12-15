import { Component, Input } from '@angular/core';
import { Message } from "@models/Whatsapp";

@Component({
  selector: 'app-web-chat-balloons',
  templateUrl: './web-chat-balloons.component.html',
  styleUrls: ['./web-chat-balloons.component.scss']
})
export class WebChatBalloonsComponent {
  @Input() titleHidden: boolean = false;
  @Input() data!: Message;

  formatDate(messageDate: string | Date): string {
    const date = new Date(messageDate); // Converte para objeto Date, se for string

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida'; // Se a data for inválida, retorna uma mensagem
    }

    return date.toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatMessage(message: string): string {
    if (!message) return '';

    // Substituir texto entre asteriscos por <b></b>
    return message.replace(/\*(.*?)\*/g, '<b>$1</b>');
  }

}
