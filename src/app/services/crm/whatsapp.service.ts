import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from "@env/environment";
import {ApiResponsePageable} from "@models/application";
import {Contact, Message, SendMessagePayload, SendMessagePayloadDto} from "@models/Whatsapp";


@Injectable({
  providedIn: 'root',
})
export class WhatsappService {

  private dataSubject = new BehaviorSubject<Contact>(null);
  public data$: Observable<Contact> = this.dataSubject.asObservable();

  setContact(data: Contact) {
    this.dataSubject.next(data);
  }

  private baseUrl = `${environment.api}/whatsapp`;

  // Variável para armazenar o contacto
  private selectedContact: Contact | null = null;

  constructor(private http: HttpClient) {
  }

  /**
   * Pesquisa chats por instância
   * @param params Parâmetros opcionais de pesquisa
   */
  searchChat(params?: Record<string, any>): Observable<ApiResponsePageable<Contact>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<ApiResponsePageable<Contact>>(`${this.baseUrl}/chats/${environment.instanceCRM}`, {params: httpParams});
  }

  /**
   * Pesquisa mensagens por remoteJid
   * @param remoteJid Identificador remoto do chat
   * @param params Parâmetros opcionais de pesquisa
   */
  searchMessage(remoteJid: string, params?: Record<string, any>): Observable<ApiResponsePageable<Message>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<ApiResponsePageable<Message>>(`${this.baseUrl}/messages/${remoteJid}`, {params: httpParams});
  }

  /**
   * Envia uma mensagem
   * @param payloadDto Dados da mensagem a ser enviada
   */
  sendMessage(payloadDto: SendMessagePayloadDto): Observable<any> {
    const payload = {...payloadDto, instance: environment.instanceCRM} as SendMessagePayload;
    return this.http.post(`${this.baseUrl}/send-message`, payload);
  }
}