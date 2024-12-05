import {Component, Input} from '@angular/core';
import {Contact} from "@models/Whatsapp";

@Component({
  selector: 'app-web-chat-attending',
  templateUrl: './web-chat-attending.component.html',
  styleUrl: './web-chat-attending.component.scss'
})
export class WebChatAttendingComponent {
  @Input() data: Contact[];

}
