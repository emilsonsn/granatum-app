import {Component, EventEmitter, Output, ViewChild, ElementRef, HostListener} from '@angular/core';

@Component({
  selector: 'app-web-chat-input',
  templateUrl: './web-chat-input.component.html',
  styleUrls: ['./web-chat-input.component.scss']
})
export class WebChatInputComponent {
  @Output() sendMessage = new EventEmitter<{ message: string; files: File[] }>();
  @ViewChild('input') inputElement: ElementRef<HTMLInputElement>;

  sign: boolean = false;
  showEmojiPicker = false;
  attachedFiles: File[] = []; // Lista de arquivos anexados

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target) && this.showEmojiPicker) {
      this.toggleEmojiPicker();
    }
  }

  ngOnInit() {
    this.sign = localStorage.getItem('sign') === 'true';
  }

  send() {
    const message = this.inputElement.nativeElement.value.trim();
    if (message || this.attachedFiles.length > 0) {
      this.sendMessage.emit({ message, files: this.attachedFiles });
      this.inputElement.nativeElement.value = ''; // Limpa a mensagem
      this.attachedFiles = []; // Limpa os arquivos
    }
  }

  onToggleChange(event: any) {
    this.sign = event.checked;
    localStorage.setItem('sign', event.checked.toString());
  }

  handleKeydown(event: KeyboardEvent) {
    const inputElement = this.inputElement.nativeElement;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    } else if (event.key === 'Enter' && event.shiftKey) {
      const cursorPosition = inputElement.selectionStart;
      inputElement.value =
        inputElement.value.substring(0, cursorPosition) +
        '\n' +
        inputElement.value.substring(cursorPosition);
      inputElement.selectionStart = inputElement.selectionEnd =
        cursorPosition + 1;
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const input = this.inputElement.nativeElement;
    const cursorPosition = input.selectionStart;

    input.value =
      input.value.substring(0, cursorPosition) +
      emoji +
      input.value.substring(cursorPosition);
    input.selectionStart = input.selectionEnd = cursorPosition + emoji.length;

    this.showEmojiPicker = false;
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachedFiles.push(...Array.from(input.files)); // Adiciona os arquivos à lista
    }
  }

  removeFile(index: number) {
    this.attachedFiles.splice(index, 1); // Remove o arquivo da lista
  }
}
