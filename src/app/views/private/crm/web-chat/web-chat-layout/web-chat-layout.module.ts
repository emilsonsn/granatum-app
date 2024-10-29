import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebChatLayoutComponent } from './web-chat-layout/web-chat-layout.component';
import {WebChatComponentsModule} from "@app/views/private/crm/web-chat/web-chat-components/web-chat-components.module";
import {RouterOutlet} from "@angular/router";



@NgModule({
  declarations: [
    WebChatLayoutComponent
  ],
  imports: [
    CommonModule,
    WebChatComponentsModule,
    RouterOutlet
  ]
})
export class WebChatLayoutModule { }
