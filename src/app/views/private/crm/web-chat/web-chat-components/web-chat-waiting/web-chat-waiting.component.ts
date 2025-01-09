import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Contact} from "@models/Whatsapp";

@Component({
  selector: 'app-web-chat-waiting',
  templateUrl: './web-chat-waiting.component.html',
  styleUrl: './web-chat-waiting.component.scss'
})
export class WebChatWaitingComponent {
  @Input() data: Contact[];
  @Input() loading: boolean = false;
  @Output() reachedTop = new EventEmitter<void>();
  @Output() eventStatus = new EventEmitter<void>();

  updateStatus($event: void) {
    this.eventStatus.emit($event);
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollPosition = Math.floor(target.scrollHeight + target.scrollTop);
    const clientHeight = Math.floor(target.clientHeight);

    // Margem de erro de 3px
    const errorMargin = 3;
    const reachedTop = Math.abs((scrollPosition - clientHeight) - (target.scrollTop * 2)) <= errorMargin;

    if (reachedTop && !this.loading) {
      this.reachedTop.emit();
    }
  }
}
