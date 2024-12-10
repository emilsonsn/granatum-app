import {Component, Input} from '@angular/core';
import {Contact} from "@models/Whatsapp";

@Component({
  selector: 'app-web-chat-header',
  templateUrl: './web-chat-header.component.html',
  styleUrl: './web-chat-header.component.scss'
})
export class WebChatHeaderComponent {
  @Input() data: Contact;
}
