import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-web-chat-layout',
  templateUrl: './web-chat-layout.component.html',
  styleUrl: './web-chat-layout.component.scss'
})
export class WebChatLayoutComponent implements OnInit, OnDestroy {
  isInsideRouterOutlet: boolean = false;
  private routerSubscription: Subscription | undefined;
  isMobile: boolean = window.innerWidth <= 768;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.updateIsMobile();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    this.router.navigate(['painel/crm/web-chat']).then();
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateRouterOutletState();
      }
    });

    this.updateRouterOutletState();
    this.updateIsMobile();
  }

  private updateRouterOutletState(): void {
    const currentUrl = this.router.url;
    this.isInsideRouterOutlet = currentUrl.startsWith('/painel/crm/web-chat/');
  }

  private updateIsMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
