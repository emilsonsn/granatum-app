import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "@env/environment";
import {ITravel, ITravelCard} from "@models/Travel";
import {ApiResponse, ApiResponsePageable, PageControl} from "@models/application";
import {Utils} from "@shared/utils";

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private apiUrl = `${environment.api}/travel`;

  constructor(private http: HttpClient) {
  }

  // Buscar viagens
  search(pageControl: PageControl, filters?): Observable<ApiResponsePageable<ITravel>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this.http.get<ApiResponsePageable<ITravel>>(`${this.apiUrl}/search?${paginate}${filterParams}`);
  }


  // Buscar viagem por ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getCards(): Observable<ApiResponse<ITravelCard>> {
    return this.http.get<ApiResponse<ITravelCard>>(`${this.apiUrl}/cards`);
  }

  // Criar viagem
  create(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // Atualizar viagem
  update(id: number, data: ITravel): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}?_method=PATCH`, data);
  }

  updateSolicitation(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/solicitation/${id}`, data);
  }

  // Deletar viagem
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Deletar anexo
  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/file/${id}`);
  }

  // Obter categorias
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-categories`);
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-tags`);
  }  

  // Obter banco
  getBank(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-bank`);
  }

  getCostCenter(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cost-centers`);
  }

  // Realizar lançamento
  upRelease(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/granatum/${orderId}`, {});
  }
}
