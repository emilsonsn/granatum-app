import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebChatProtectRoutingModule } from './web-chat-protect-routing.module';
import { WebChatProtectComponent } from './web-chat-protect/web-chat-protect.component';
import {LottieComponent} from "ngx-lottie";


@NgModule({
  declarations: [
    WebChatProtectComponent
  ],
  imports: [
    CommonModule,
    WebChatProtectRoutingModule,
    LottieComponent
  ]
})
export class WebChatProtectModule { }
