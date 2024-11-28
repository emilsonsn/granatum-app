import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WebChatRoutingModule} from './web-chat-routing.module';
import {WebChatLayoutModule} from "@app/views/private/crm/web-chat/web-chat-layout/web-chat-layout.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WebChatRoutingModule,
    WebChatLayoutModule
  ]
})
export class WebChatModule {
}
