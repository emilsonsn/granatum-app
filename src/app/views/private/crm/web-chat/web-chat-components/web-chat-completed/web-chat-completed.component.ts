import {Component, Input} from '@angular/core';
import {Contact} from "@models/contact";

@Component({
  selector: 'app-web-chat-completed',
  templateUrl: './web-chat-completed.component.html',
  styleUrl: './web-chat-completed.component.scss'
})
export class WebChatCompletedComponent {
  @Input() data: Contact[];
}
