import {Component, Input} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-web-chat-protect',
  templateUrl: './web-chat-protect.component.html',
  styleUrl: './web-chat-protect.component.scss'
})
export class WebChatProtectComponent {
  options: AnimationOptions = {
    path: '/assets/json/animation_web_chat_protect.json',
  };
}
