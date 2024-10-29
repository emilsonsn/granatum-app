import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-web-chat-item',
  templateUrl: './web-chat-item.component.html',
  styleUrl: './web-chat-item.component.scss'
})
export class WebChatItemComponent {
  @Input() tag: boolean;
  @Input() qtdBadge: number;

}
