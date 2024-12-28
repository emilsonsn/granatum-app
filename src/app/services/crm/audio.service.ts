import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioUrl: string | null = null;
  private isRecording = false;

  constructor() {}

  // Inicializa o MediaRecorder
  init() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
          };
          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            this.audioUrl = URL.createObjectURL(audioBlob);
            this.audioChunks = [];  // Limpa os chunks de áudio para a próxima gravação
          };
        })
        .catch((error) => {
          console.error('Erro ao acessar o microfone:', error);
        });
    } else {
      console.error('getUserMedia não é suportado neste navegador');
    }
  }

  // Inicia a gravação de áudio
  start() {
    if (this.mediaRecorder) {
      this.mediaRecorder.start();
      this.isRecording = true;
    } else {
      console.error('MediaRecorder não foi inicializado');
    }
  }

  // Pausa a gravação
  pause() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.pause();
      this.isRecording = false;
    }
  }

  // Retoma a gravação
  resume() {
    if (this.mediaRecorder && !this.isRecording) {
      this.mediaRecorder.resume();
      this.isRecording = true;
    }
  }

  // Para a gravação e retorna a URL do áudio gravado
  // Para a gravação e retorna a URL do áudio gravado
  stop(): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();  // Para a gravação
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });  // Use audioChunks aqui
          this.audioChunks = [];  // Limpa os chunks para a próxima gravação
          resolve(audioBlob);  // Retorna o Blob com o áudio
        };
        this.mediaRecorder.onerror = (error) => {
          reject(error);
        };
      } else {
        resolve(null);
      }
    });
  }



  // Apaga o áudio gravado
  delete() {
    this.audioUrl = null;
    this.audioChunks = [];
  }

  // Verifica se o MediaRecorder está ativo
  isRecordingActive() {
    return this.isRecording;
  }

  // Retorna a URL do áudio gravado
  getAudioUrl() {
    return this.audioUrl;
  }
}
