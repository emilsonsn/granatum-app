import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WebChatItemComponent} from './web-chat-item/web-chat-item.component';
import {AvatarModule} from "@shared/components/avatar/avatar.module";
import {
  WebChatAttendingComponent
} from "@app/views/private/crm/web-chat/web-chat-components/web-chat-attending/web-chat-attending.component";
import {
  WebChatWaitingComponent
} from "@app/views/private/crm/web-chat/web-chat-components/web-chat-waiting/web-chat-waiting.component";
import {
  WebChatCompletedComponent
} from "@app/views/private/crm/web-chat/web-chat-components/web-chat-completed/web-chat-completed.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import { WebChatBalloonsComponent } from './web-chat-balloons/web-chat-balloons.component';


@NgModule({
  declarations: [
    WebChatItemComponent,
    WebChatAttendingComponent,
    WebChatWaitingComponent,
    WebChatCompletedComponent,
    WebChatBalloonsComponent
  ],
  exports: [
    WebChatItemComponent,
    WebChatAttendingComponent,
    WebChatWaitingComponent,
    WebChatCompletedComponent,
    WebChatBalloonsComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    MatTab,
    MatTabGroup
  ]
})
export class WebChatComponentsModule {
}
