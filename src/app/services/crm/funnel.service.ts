import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponsePageable, PageControl } from '@models/application';
import { Funnel } from '@models/Funnel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FunnelService {
  private readonly baseUrl = `${environment.api}/funnel`;

  constructor(private readonly _http: HttpClient) { }

  getFunnels(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Funnel>> {

    return this._http.get<ApiResponsePageable<Funnel>>(`${this.baseUrl}/search`);
  }

  // Get a list of funnels with optional query parameters
  search(params?: any): Observable<any> {
    return this._http.get(`${this.baseUrl}/search`, {params});
  }

  // Get a funnel by ID
  getById(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new funnel
  create(funnelData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, funnelData);
  }

  // Update an existing funnel
  update(id: string, funnelData: any): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, funnelData);
  }

  // Delete a funnel by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
