import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {AudioService} from "@services/crm/audio.service";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-web-chat-input',
  templateUrl: './web-chat-input.component.html',
  styleUrls: ['./web-chat-input.component.scss']
})
export class WebChatInputComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<{ message: string; files: File[] }>();
  @Output() sendAudioMessage = new EventEmitter<{ file: File }>();
  @ViewChild('input') inputElement: ElementRef<HTMLInputElement>;

  sign: boolean = false;
  showEmojiPicker = false;
  attachedFiles: File[] = [];  // Lista de arquivos anexados
  isRecording = false;
  isPaused = false;  // Indica se a gravação está pausada
  audioUrl: string | null = null;  // URL do áudio gravado

  constructor(private eRef: ElementRef, private audioService: AudioService) {
  }

  options: AnimationOptions = {
    path: '/assets/json/animation_audio_dark.json',
  };

  // Detecta clique fora do componente e fecha o emoji picker
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target) && this.showEmojiPicker) {
      this.toggleEmojiPicker();
    }
  }

  ngOnInit() {
    this.sign = localStorage.getItem('sign') === 'true';
  }

  // Enviar mensagem e anexos
  send() {
    if (!this.audioUrl) {
      const message = this.inputElement.nativeElement.value.trim();
      if (message || this.attachedFiles.length > 0) {
        this.sendMessage.emit({message, files: this.attachedFiles});
        this.inputElement.nativeElement.value = '';  // Limpa a mensagem
        this.attachedFiles = [];  // Limpa os arquivos
      }
    }

    if (this.audioUrl) {
      this.sendAudio();
    }
  }

  // Controla a alternância da assinatura
  onToggleChange(event: any) {
    this.sign = event.checked;
    localStorage.setItem('sign', event.checked.toString());
  }

  // Lidar com a tecla Enter no campo de mensagem
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

  // Alterna a visibilidade do emoji picker
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // Adiciona o emoji no campo de entrada
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

  // Seleciona arquivos para anexar
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachedFiles.push(...Array.from(input.files));  // Adiciona os arquivos à lista
    }
  }

  // Remove um arquivo da lista de anexos
  removeFile(index: number) {
    this.attachedFiles.splice(index, 1);  // Remove o arquivo da lista
  }

  // Inicia a gravação de áudio
  startRecording() {
    this.audioService.start();
    this.isRecording = true;
    this.isPaused = false;
  }

  // Pausa a gravação de áudio
  pauseRecording() {
    this.audioService.pause();
    this.isPaused = true;
  }

  // Retoma a gravação de áudio
  resumeRecording() {
    this.audioService.resume();
    this.isPaused = false;
  }

  // Para a gravação e obtém a URL do áudio gravado
  async stopRecording() {
    // Garantir que o áudio seja armazenado e a URL seja gerada
    const audioBlob = await this.audioService.stop();  // Espera o áudio ser finalizado e obtém o Blob
    if (audioBlob) {
      // Converte o Blob em uma URL utilizável
      this.audioUrl = URL.createObjectURL(audioBlob);
      this.isRecording = false;
      this.isPaused = false;
    }
  }

  // Envia o áudio gravado como um arquivo
  sendAudio() {
    if (this.audioUrl) {
      fetch(this.audioUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'audio.mp3', {type: 'audio/mp3'});
          this.sendAudioMessage.emit({file: file});
          this.audioUrl = null;
        });
    }
  }

  // Apaga o áudio gravado
  deleteAudio() {
    this.audioService.delete();
    this.audioUrl = null;
    this.isRecording = false;
    this.isPaused = false;
  }
}
