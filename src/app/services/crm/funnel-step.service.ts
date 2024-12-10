import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponsePageable, PageControl } from '@models/application';
import { FunnelStep } from '@models/Funnel';
import { Observable } from 'rxjs';
import { Utils } from '@shared/utils';

@Injectable({
  providedIn: 'root'
})
export class FunnelStepService {
  private readonly baseUrl = `${environment.api}/funnel-step`;

  constructor(private readonly _http: HttpClient) { }

  getFunnelsSteps(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<FunnelStep>> {

    let filterParams = '';
    if(filters) filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<FunnelStep>>(`${this.baseUrl}/search?${filterParams}`);
  }

  // Get a list of funnels steps with optional query parameters
  search(params?: any): Observable<any> {
    return this._http.get(`${this.baseUrl}/search`, {params});
  }

  // Get a funnel step by ID
  getById(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new funnel step
  create(funnelStepData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, funnelStepData);
  }

  // Update an existing funnel step
  update(id: string, funnelStepData: any): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, funnelStepData);
  }

  // Delete a funnel step by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
