import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponsePageable, PageControl } from '@models/application';
import { Automations } from '@models/automations';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutomationsService {
  private readonly baseUrl = `${environment.api}/automations`;

  constructor(private readonly _http: HttpClient) { }

  getAutomations(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Automations>> {

    return this._http.get<ApiResponsePageable<Automations>>(`${this.baseUrl}/search`);
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
  create(automationsData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, automationsData);
  }

  // Update an existing funnel step
  update(id: string, automationsData: Automations): Observable<any> {
    return this._http.post(`${this.baseUrl}/${id}?_method=patch`, automationsData);
  }

  // Delete a funnel step by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
