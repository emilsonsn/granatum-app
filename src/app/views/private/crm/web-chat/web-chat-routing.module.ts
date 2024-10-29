import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  WebChatLayoutComponent
} from "@app/views/private/crm/web-chat/web-chat-layout/web-chat-layout/web-chat-layout.component";

const routes: Routes = [
  {
    path: '',
    component: WebChatLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./web-chat-protect/web-chat-protect.module').then(m => m.WebChatProtectModule)
      },
      {
        path: ':uuid',
        loadChildren: () => import('./web-chat-private/web-chat-private.module').then(m => m.WebChatPrivateModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebChatRoutingModule {
}
