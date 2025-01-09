import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Contact} from "@models/Whatsapp";

@Component({
  selector: 'app-web-chat-attending',
  templateUrl: './web-chat-attending.component.html',
  styleUrl: './web-chat-attending.component.scss'
})
export class WebChatAttendingComponent {
  @Input() data: Contact[];
  @Output() eventStatus = new EventEmitter<void>();

  updateStatus($event: void) {
    this.eventStatus.emit($event);
  }
}
