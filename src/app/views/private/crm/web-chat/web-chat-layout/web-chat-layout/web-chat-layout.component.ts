import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-web-chat-layout',
  templateUrl: './web-chat-layout.component.html',
  styleUrl: './web-chat-layout.component.scss'
})
export class WebChatLayoutComponent {
  constructor(private router: Router) {
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    this.router.navigate(['painel/crm/web-chat']).then();
  }
}
