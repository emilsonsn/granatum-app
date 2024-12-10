import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponsePageable, PageControl } from '@models/application';
import { Partner } from '@models/partner';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnersService {
  private readonly baseUrl = `${environment.api}/partner`;

  constructor(private readonly _http: HttpClient) { }

  getBanks(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Partner>> {

    return this._http.get<ApiResponsePageable<Partner>>(`${this.baseUrl}/search`);
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
  create(partnerData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, partnerData);
  }

  // Update an existing funnel step
  update(id: string, partnerData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/${id}?_method=patch`, partnerData);
  }

  // Delete a funnel step by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
