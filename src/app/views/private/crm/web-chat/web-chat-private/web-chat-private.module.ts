import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebChatPrivateRoutingModule } from './web-chat-private-routing.module';
import { WebChatPrivateComponent } from './web-chat-private/web-chat-private.component';
import {WebChatComponentsModule} from "@app/views/private/crm/web-chat/web-chat-components/web-chat-components.module";


@NgModule({
  declarations: [
    WebChatPrivateComponent
  ],
  imports: [
    CommonModule,
    WebChatPrivateRoutingModule,
    WebChatComponentsModule
  ]
})
export class WebChatPrivateModule { }
