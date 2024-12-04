import {Component, Input} from '@angular/core';
import {Message} from "@models/message";

@Component({
  selector: 'app-web-chat-conversa',
  templateUrl: './web-chat-conversa.component.html',
  styleUrls: ['./web-chat-conversa.component.scss']
})
export class WebChatConversaComponent {
  @Input() data!: { [p: string]: Message[] };

  getDateLabel(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return date.toDateString();
  }
}
