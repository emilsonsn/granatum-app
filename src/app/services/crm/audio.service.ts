import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioUrl: string | null = null;
  private isRecording = false;
  private audioStream: MediaStream | null = null;

  constructor() {}

  // Inicia a gravação de áudio
  async start() {
    if (!this.mediaRecorder) {
      try {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.audioStream);
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioUrl = URL.createObjectURL(audioBlob);
          this.audioChunks = []; // Limpa os chunks para a próxima gravação
          this.stopAudioStream(); // Libera o microfone
        };
        this.mediaRecorder.onerror = (error) => {
          console.error('Erro no MediaRecorder:', error);
        };
      } catch (error) {
        console.error('Erro ao acessar o microfone:', error);
        return;
      }
    }

    if (this.mediaRecorder.state === 'inactive') {
      this.mediaRecorder.start();
      this.isRecording = true;
    }
  }

  // Pausa a gravação
  pause() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isRecording = false;
    }
  }

  // Retoma a gravação
  resume() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isRecording = true;
    }
  }

  // Para a gravação e retorna o áudio gravado
  stop(): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioChunks = []; // Limpa os chunks para a próxima gravação
          this.stopAudioStream(); // Libera o microfone
          resolve(audioBlob);
        };
        this.mediaRecorder.onerror = (error) => {
          reject(error);
        };
        this.mediaRecorder.stop(); // Para a gravação
        this.isRecording = false;
      } else {
        resolve(null);
      }
    });
  }

  // Libera o stream de áudio e o microfone
  private stopAudioStream() {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }
    this.mediaRecorder = null;
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
