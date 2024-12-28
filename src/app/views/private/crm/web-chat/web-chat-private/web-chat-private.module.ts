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
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {MatTooltip} from "@angular/material/tooltip";
import {LottieComponent} from "ngx-lottie";


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
    AvatarModule,
    MatSlideToggle,
    PickerComponent,
    MatTooltip,
    LottieComponent
  ]
})
export class WebChatPrivateModule { }
