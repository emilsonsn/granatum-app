import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "@env/environment";
import {ApiResponse} from "@models/application";
import {BudgetStats} from "@models/budgetStats";

@Injectable({
  providedIn: 'root',
})
export class DashboardCrmService {
  private baseUrl = `${environment.api}/crm-dashboard`;

  constructor(private http: HttpClient) {
  }

  /**
   * Obtém os dados dos cards com base no período especificado.
   * @param period O período (Daily, Monthly ou Annually).
   * @returns Observable com os dados dos cards.
   */
  getCards(period: string): Observable<ApiResponse<BudgetStats>> {
    return this.http.get<ApiResponse<BudgetStats>>(`${this.baseUrl}/cards/${period}`);
  }

  /**
   * Obtém os dados do gráfico de orçamento com base no status especificado.
   * @param status O status do orçamento (opcional).
   * @returns Observable com os dados do gráfico.
   */
  getBudgetGraphic(status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.get(`${this.baseUrl}/budget-graphic/${status}`, {params});
  }
}
