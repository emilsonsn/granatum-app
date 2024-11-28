import {Component, Input} from '@angular/core';
import {Contact} from "@models/contact";

@Component({
  selector: 'app-web-chat-waiting',
  templateUrl: './web-chat-waiting.component.html',
  styleUrl: './web-chat-waiting.component.scss'
})
export class WebChatWaitingComponent {
  @Input() data: Contact[];
}
