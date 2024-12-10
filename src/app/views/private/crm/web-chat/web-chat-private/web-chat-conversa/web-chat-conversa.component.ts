import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from "@models/Whatsapp";
import dayjs from "dayjs";

@Component({
  selector: 'app-web-chat-conversa',
  templateUrl: './web-chat-conversa.component.html',
  styleUrls: ['./web-chat-conversa.component.scss']
})
export class WebChatConversaComponent {
  @Input() data!: { [p: string]: Message[] };
  @Input() loading: boolean = false;
  @Output() reachedTop = new EventEmitter<void>();

  getDateLabel(date: string): string {
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');

    if (dayjs(date).isSame(today, 'day')) {
      return 'Hoje';
    } else if (dayjs(date).isSame(yesterday, 'day')) {
      return 'Ontem';
    }
    return dayjs(date).format('YYYY-MM-DD');
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollPosition = Math.floor(target.scrollHeight + target.scrollTop);
    const clientHeight = Math.floor(target.clientHeight);

    // Margem de erro de 3px
    const errorMargin = 3;
    const reachedTop = Math.abs(scrollPosition - clientHeight) <= errorMargin;

    if (reachedTop && !this.loading) {
      this.reachedTop.emit();
    }
  }



}
