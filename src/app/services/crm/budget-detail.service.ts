import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponsePageable, PageControl } from '@models/application';
import { BudgetDetail } from '@models/budgetDetail';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetDetailService {
  private readonly baseUrl = `${environment.api}/budget-detail`;

  constructor(private readonly _http: HttpClient) { }

  getBanks(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<BudgetDetail>> {

    return this._http.get<ApiResponsePageable<BudgetDetail>>(`${this.baseUrl}/search`);
  }

  // Get a list of funnels steps with optional query parameters
  search(pageControl?: any, filters?: any): Observable<any> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);
    
    return this._http.get(`${this.baseUrl}/search?${paginate}${filterParams}`);
  }

  // Get a funnel step by ID
  getById(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new funnel step
  create(budgetDetailData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, budgetDetailData);
  }

  // Update an existing funnel step
  update(id: string, budgetDetailData: BudgetDetail): Observable<any> {
    return this._http.post(`${this.baseUrl}/${id}?_method=patch`, budgetDetailData);
  }

  // Delete a funnel step by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
