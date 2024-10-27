import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WebChatComponent} from "@app/views/private/crm/web-chat/web-chat/web-chat.component";

const routes: Routes = [
  {
    path: '',
    component: WebChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebChatRoutingModule { }
