import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Contact} from "@models/Whatsapp";

@Component({
  selector: 'app-web-chat-completed',
  templateUrl: './web-chat-completed.component.html',
  styleUrl: './web-chat-completed.component.scss'
})
export class WebChatCompletedComponent {
  @Input() data: Contact[];
  @Output() eventStatus = new EventEmitter<void>();

  updateStatus($event: void) {
    this.eventStatus.emit($event);
  }
}
