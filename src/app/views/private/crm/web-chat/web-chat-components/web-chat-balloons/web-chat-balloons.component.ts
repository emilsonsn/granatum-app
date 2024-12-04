import {Component, Input} from '@angular/core';
import {Message} from "@models/message";

@Component({
  selector: 'app-web-chat-balloons',
  templateUrl: './web-chat-balloons.component.html',
  styleUrl: './web-chat-balloons.component.scss'
})
export class WebChatBalloonsComponent {
  @Input() titleHidden: boolean = false;
  @Input() data!: Message;


  formatDate(messageDate: Date): string {
    return messageDate.toLocaleString(['pt-BR'], {
      // day: '2-digit',
      // month: '2-digit',
      // year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }


}
