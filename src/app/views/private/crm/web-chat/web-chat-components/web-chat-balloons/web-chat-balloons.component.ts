import { Component, Input } from '@angular/core';
import {Message, MessageType} from "@models/Whatsapp";

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

  isOnlyEmoji(message: string): boolean {
    const emojiRegex = /^[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F700}-\u{1F77F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]+$/u;
    return emojiRegex.test(message.trim());
  }

  protected readonly MessageType = MessageType;
}
