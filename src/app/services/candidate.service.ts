import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Candidate, CandidateCards } from '@models/candidate';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private endpoint: string = 'candidate';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Candidate>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Candidate>>(`${environment.api}/${this.endpoint}/search?${paginate}${filterParams}`);
  }

  public post(candidate: Candidate | FormData): Observable<ApiResponse<Candidate>> {
    return this._http.post<ApiResponse<Candidate>>(`${environment.api}/${this.endpoint}/create`, candidate);
  }

  public patch(id: number, candidate: Candidate | FormData): Observable<ApiResponse<Candidate>> {
    return this._http.post<ApiResponse<Candidate>>(`${environment.api}/${this.endpoint}/${id}?_method=PATCH`, candidate);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.endpoint}/${id}`);
  }

  public getCards(): Observable<ApiResponse<CandidateCards>> {
    return this._http.get<ApiResponse<CandidateCards>>(`${environment.api}/${this.endpoint}/cards`);
  }

  public deleteFile(id: number): Observable<any> {
    return this._http.delete(`${environment.api}/${this.endpoint}/file/${id}`);
  }

}
