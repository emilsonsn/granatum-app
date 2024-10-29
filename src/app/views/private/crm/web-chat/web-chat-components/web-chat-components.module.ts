import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebChatHeaderComponent } from './web-chat-header/web-chat-header.component';
import { WebChatSidebarComponent } from './web-chat-sidebar/web-chat-sidebar.component';
import { WebChatInputComponent } from './web-chat-input/web-chat-input.component';
import { WebChatConversaComponent } from './web-chat-conversa/web-chat-conversa.component';



@NgModule({
  declarations: [
    WebChatHeaderComponent,
    WebChatSidebarComponent,
    WebChatInputComponent,
    WebChatConversaComponent
  ],
  exports: [
    WebChatSidebarComponent,
    WebChatHeaderComponent,
    WebChatConversaComponent,
    WebChatInputComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WebChatComponentsModule { }
