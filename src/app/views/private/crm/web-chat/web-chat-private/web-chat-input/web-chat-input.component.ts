import {Component, EventEmitter, Output, ViewChild, ElementRef, HostListener} from '@angular/core';

@Component({
  selector: 'app-web-chat-input',
  templateUrl: './web-chat-input.component.html',
  styleUrls: ['./web-chat-input.component.scss']
})
export class WebChatInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('input') inputElement: ElementRef<HTMLInputElement>; // Referência ao input
  sign: boolean = false;
  showEmojiPicker = false;

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    // Verifica se o clique foi fora do componente
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (this.showEmojiPicker) {
        this.toggleEmojiPicker();
      }
    }
  }

  ngOnInit(){
    this.sign = localStorage.getItem('sign') === 'true' ? true : false;
  }

  // Método para enviar mensagem
  send() {
    const message = this.inputElement.nativeElement.value;
    if (message.trim()) {
      this.sendMessage.emit(message); // Emite a mensagem
      this.inputElement.nativeElement.value = ''; // Limpa o input após enviar
    }
  }

  onToggleChange(event){
    this.sign = event.checked;
    localStorage.setItem('sign', event.checked.toString());
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

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const input = this.inputElement.nativeElement;
    const cursorPosition = input.selectionStart;

    // Insere o emoji na posição do cursor
    input.value = input.value.substring(0, cursorPosition) + emoji + input.value.substring(cursorPosition);
    input.selectionStart = input.selectionEnd = cursorPosition + emoji.length;

    this.showEmojiPicker = false; // Fecha o seletor após escolher um emoji
  }

}
