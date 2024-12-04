import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-web-chat-input',
  templateUrl: './web-chat-input.component.html',
  styleUrls: ['./web-chat-input.component.scss']
})
export class WebChatInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('input') inputElement: ElementRef<HTMLInputElement>; // Referência ao input

  // Método para enviar mensagem
  send() {
    const message = this.inputElement.nativeElement.value;
    if (message.trim()) {
      this.sendMessage.emit(message); // Emite a mensagem
      this.inputElement.nativeElement.value = ''; // Limpa o input após enviar
    }
  }

  // Método para capturar eventos de teclado
  handleKeydown(event: KeyboardEvent) {
    const inputElement = this.inputElement.nativeElement;

    // Se pressionar Enter sem Shift, envia a mensagem
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Impede o comportamento padrão de quebra de linha
      this.send(); // Envia a mensagem
    }
    // Se pressionar Shift + Enter, insere uma nova linha
    else if (event.key === 'Enter' && event.shiftKey) {
      const cursorPosition = inputElement.selectionStart;
      inputElement.value = inputElement.value.substring(0, cursorPosition) + '\n' + inputElement.value.substring(cursorPosition);
      inputElement.selectionStart = inputElement.selectionEnd = cursorPosition + 1;
    }
  }
}
