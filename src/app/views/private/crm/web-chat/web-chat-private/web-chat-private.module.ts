import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebChatPrivateRoutingModule } from './web-chat-private-routing.module';
import { WebChatPrivateComponent } from './web-chat-private/web-chat-private.component';
import {WebChatComponentsModule} from "@app/views/private/crm/web-chat/web-chat-components/web-chat-components.module";
import {
  WebChatInputComponent
} from "@app/views/private/crm/web-chat/web-chat-private/web-chat-input/web-chat-input.component";
import {
  WebChatConversaComponent
} from "@app/views/private/crm/web-chat/web-chat-private/web-chat-conversa/web-chat-conversa.component";
import {
  WebChatHeaderComponent
} from "@app/views/private/crm/web-chat/web-chat-private/web-chat-header/web-chat-header.component";
import {
  WebChatSidebarComponent
} from "@app/views/private/crm/web-chat/web-chat-layout/web-chat-sidebar/web-chat-sidebar.component";
import {AvatarModule} from "@shared/components/avatar/avatar.module";


@NgModule({
  declarations: [
    WebChatPrivateComponent,
    WebChatHeaderComponent,
    WebChatConversaComponent,
    WebChatInputComponent
  ],
  imports: [
    CommonModule,
    WebChatPrivateRoutingModule,
    WebChatComponentsModule,
    AvatarModule
  ]
})
export class WebChatPrivateModule { }
