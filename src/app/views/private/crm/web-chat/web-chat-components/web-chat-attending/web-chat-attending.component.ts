import {Component, Input, SimpleChanges} from '@angular/core';
import {Contact} from "@models/contact";

@Component({
  selector: 'app-web-chat-attending',
  templateUrl: './web-chat-attending.component.html',
  styleUrl: './web-chat-attending.component.scss'
})
export class WebChatAttendingComponent {
  @Input() data: Contact[];

}
