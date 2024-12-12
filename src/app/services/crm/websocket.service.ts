import {Injectable} from '@angular/core';
import {filter, Observable, Subject} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject: Subject<any> = new Subject<any>();
  private isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket$ = webSocket(environment.wsUrl); // URL do seu servidor WebSocket

    this.socket$.subscribe(
      msg => this.messagesSubject.next(msg), // Envia mensagens recebidas para o Subject
      err => {
        console.error('Erro na conexão:', err);
        this.isConnected = false;
      },
      () => {
        console.log('Conexão fechada');
        this.isConnected = false;
      }
    );

    this.isConnected = true;
  }

  public subscribeToChannel(channel: string): Observable<any> {
    if (!this.isConnected) {
      this.connect(); // Tenta reconectar se não estiver conectado
    }

    // Envia a mensagem de inscrição no canal
    this.socket$.next({
      "event": "pusher:subscribe",
      "data": {
        "channel": channel
      }
    });

    return this.messagesSubject.asObservable().pipe(
      filter(msg => msg.channel === channel) // Filtra mensagens para o canal específico
    );
  }

  public sendMessage(msg: any): void {
    if (this.isConnected) {
      this.socket$.next(msg); // Envia uma mensagem para o servidor
    }
  }
}
