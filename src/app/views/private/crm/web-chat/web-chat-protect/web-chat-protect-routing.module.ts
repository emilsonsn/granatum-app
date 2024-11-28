import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  WebChatProtectComponent
} from "@app/views/private/crm/web-chat/web-chat-protect/web-chat-protect/web-chat-protect.component";

const routes: Routes = [
  {
    path: '',
    component: WebChatProtectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebChatProtectRoutingModule { }
