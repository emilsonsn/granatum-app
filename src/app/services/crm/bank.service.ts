import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponsePageable, PageControl } from '@models/application';
import { Bank } from '@models/bank';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private readonly baseUrl = `${environment.api}/bank`;

  constructor(private readonly _http: HttpClient) { }

  getBanks(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Bank>> {

    return this._http.get<ApiResponsePageable<Bank>>(`${this.baseUrl}/search`);
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
  create(bankData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, bankData);
  }

  // Update an existing funnel step
  update(id: string, bankData: Bank): Observable<any> {
    return this._http.post(`${this.baseUrl}/${id}?_method=patch`, bankData);
  }

  // Delete a funnel step by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
