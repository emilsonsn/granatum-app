import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebChatRoutingModule } from './web-chat-routing.module';
import { WebChatComponent } from './web-chat/web-chat.component';


@NgModule({
  declarations: [
    WebChatComponent
  ],
  imports: [
    CommonModule,
    WebChatRoutingModule
  ]
})
export class WebChatModule { }
