import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Profession, ProfessionCards } from '@models/profession';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessionService {

  private endpoint: string = 'profession';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Profession>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Profession>>(`${environment.api}/${this.endpoint}/search?${paginate}${filterParams}`);
  }

  public post(profession: Profession): Observable<ApiResponse<Profession>> {
    return this._http.post<ApiResponse<Profession>>(`${environment.api}/${this.endpoint}/create`, profession);
  }

  public patch(id: number, profession: Profession): Observable<ApiResponse<Profession>> {
    return this._http.patch<ApiResponse<Profession>>(`${environment.api}/${this.endpoint}/${id}`, profession);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.endpoint}/${id}`);
  }

  public getCards(): Observable<ApiResponse<ProfessionCards>> {
    return this._http.get<ApiResponse<ProfessionCards>>(`${environment.api}/${this.endpoint}/cards`);
  }

}
