import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponsePageable, PageControl } from '@models/application';
import { Budget, BudgetGenerated } from '@models/budget';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetGeneratedService {
  private readonly baseUrl = `${environment.api}/budget-generated`;

  constructor(private readonly _http: HttpClient) { }

  search(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<BudgetGenerated>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);
    
    return this._http.get<ApiResponsePageable<BudgetGenerated>>(`${this.baseUrl}/search?${paginate}${filterParams}`);
  }

  getById(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new funnel step
  create(budgetData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, budgetData);
  }

  // Update an existing funnel step
  update(id: string, budgetData: Budget): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, budgetData);
  }

  // Delete a funnel step by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
