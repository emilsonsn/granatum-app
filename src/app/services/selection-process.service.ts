import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { SelectionProcess, SelectionProcessCards } from '@models/selectionProccess';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionProcessService {

  private endpoint: string = 'selection-process';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<SelectionProcess>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<SelectionProcess>>(`${environment.api}/${this.endpoint}/search?${paginate}${filterParams}`);
  }

  public post(SelectionProcess: SelectionProcess): Observable<ApiResponse<SelectionProcess>> {
    return this._http.post<ApiResponse<SelectionProcess>>(`${environment.api}/${this.endpoint}/create`, SelectionProcess);
  }

  public patch(id: number, SelectionProcess: SelectionProcess): Observable<ApiResponse<SelectionProcess>> {
    return this._http.patch<ApiResponse<SelectionProcess>>(`${environment.api}/${this.endpoint}/${id}`, SelectionProcess);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.endpoint}/${id}`);
  }

  public getCards(): Observable<ApiResponse<SelectionProcessCards>> {
    return this._http.get<ApiResponse<SelectionProcessCards>>(`${environment.api}/${this.endpoint}/cards`);
  }

}
