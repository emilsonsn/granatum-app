import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Vacancy, VacancyCards } from '@models/vacancy';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  private endpoint: string = 'vacancy';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Vacancy>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Vacancy>>(`${environment.api}/${this.endpoint}/search`);
  }

  public post(vacancy: Vacancy): Observable<ApiResponse<Vacancy>> {
    return this._http.post<ApiResponse<Vacancy>>(`${environment.api}/${this.endpoint}/create`, vacancy);
  }

  public patch(id: number, vacancy: Vacancy): Observable<ApiResponse<Vacancy>> {
    return this._http.patch<ApiResponse<Vacancy>>(`${environment.api}/${this.endpoint}/${id}`, vacancy);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.endpoint}/${id}`);
  }

  public getCards(): Observable<ApiResponse<VacancyCards>> {
    return this._http.get<ApiResponse<VacancyCards>>(`${environment.api}/${this.endpoint}/cards`);
  }

}
