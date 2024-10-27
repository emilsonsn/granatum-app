import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {ApiResponsePageable, PageControl} from "@models/application";
import {Lead} from "@models/Lead";

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly baseUrl = `${environment.api}/lead`;

  constructor(private readonly _http: HttpClient) {
  }

  getLeads(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Lead>> {

    return this._http.get<ApiResponsePageable<Lead>>(`${this.baseUrl}/search`);
  }

  // Get a list of leads with optional query parameters
  search(params?: any): Observable<any> {
    return this._http.get(`${this.baseUrl}/search`, {params});
  }

  // Get a lead by ID
  getById(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new lead
  create(leadData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, leadData);
  }

  // Update an existing lead
  update(id: string, leadData: any): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, leadData);
  }

  // Delete a lead by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
