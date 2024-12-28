import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from "@env/environment";
import {ApiResponsePageable, PageControl} from "@models/application";
import {
  Contact,
  ContactStatus,
  Message,
  SendMediaResponse,
  SendMessagePayload,
  SendMessagePayloadDto
} from "@models/Whatsapp";
import {Utils} from "@shared/utils";

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

  private selectedContact: Contact | null = null;

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Pesquisa chats por instância
   * @param params Parâmetros opcionais de pesquisa
   * @param instance
   */
  searchChat(params?: Record<string, any>, instance?: string): Observable<ApiResponsePageable<Contact>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<ApiResponsePageable<Contact>>(`${this.baseUrl}/chats/${instance}`, {params: httpParams});
  }

  /**
   * Pesquisa mensagens por remoteJid
   * @param remoteJid Identificador remoto do chat
   * @param pageControl Parâmetros opcionais de pesquisa
   * @param filters
   */
  searchMessage(remoteJid: string, pageControl?: PageControl, filters?: Record<string, any>): Observable<ApiResponsePageable<Message>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this.http.get<ApiResponsePageable<Message>>(`${this.baseUrl}/messages/${remoteJid}?${paginate}${filterParams}`);
  }

  /**
   * Envia uma mensagem
   * @param payloadDto Dados da mensagem a ser enviada
   */
  sendMessage(payloadDto: SendMessagePayloadDto, instance: string): Observable<any> {
    const payload = {...payloadDto, instance: instance} as SendMessagePayload;
    return this.http.post(`${this.baseUrl}/send-message`, payload);
  }

  /**
   * Marca mensagens como lidas
   * @param remoteJid Identificador remoto do chat
   * @param instance Instância do WhatsApp
   */
  read(remoteJid: string, instance: string): Observable<any> {
    const payload = {number: remoteJid, instance: instance};
    return this.http.post(`${this.baseUrl}/read-message`, payload);
  }

  /**
   * Atualiza o status do contato
   * @param id ID do contato
   * @param status Novo status do contato
   */
  updateStatus(id: number, status: ContactStatus): Observable<any> {
    const payload = {status};
    return this.http.patch(`${this.baseUrl}/update-status/${id}`, payload);
  }

  /**
   * Envia mídia com mensagem opcional
   * @param payload Dados para envio da mídia
   */
  sendMedia(payload: SendMediaResponse): Observable<any> {
    const formData = new FormData();
    formData.append('number', payload.number);
    formData.append('instance', payload.instance);

    if (payload.message) {
      formData.append('message', payload.message);
    }

    payload.medias.forEach((media, index) => {
      formData.append(`medias[${index}]`, media);
    });

    return this.http.post(`${this.baseUrl}/send-midia`, formData);
  }
}
