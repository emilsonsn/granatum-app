import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ApiResponsePageable, PageControl} from '@models/application';
import {FunnelStep} from '@models/Funnel';
import {Observable} from 'rxjs';
import {Utils} from '@shared/utils';

@Injectable({
  providedIn: 'root',
})
export class FunnelStepService {
  private readonly baseUrl = `${environment.api}/funnel-step`;
  private readonly baseStepUrl = `${environment.api}/lead`;

  constructor(private readonly _http: HttpClient) {
  }

  /**
   * Get a list of funnel steps with optional filters and pagination.
   * @param pageControl Pagination and sorting information.
   * @param filters Query filters.
   * @returns An observable of pageable funnel steps.
   */
  getFunnelsSteps(
    pageControl?: PageControl,
    filters?: any
  ): Observable<ApiResponsePageable<FunnelStep>> {
    let filterParams = '';
    if (filters) filterParams = Utils.mountPageControl(filters);
    return this._http.get<ApiResponsePageable<FunnelStep>>(
      `${this.baseUrl}/search?${filterParams}`
    );
  }

  /**
   * Search funnel steps with optional query parameters.
   * @param params Query parameters.
   * @returns An observable of pageable funnel steps.
   */
  search(params?: any): Observable<ApiResponsePageable<FunnelStep>> {
    return this._http.get<ApiResponsePageable<FunnelStep>>(
      `${this.baseUrl}/search`,
      {params}
    );
  }

  /**
   * Get a specific funnel step by its ID.
   * @param id Funnel step ID.
   * @returns An observable of the funnel step.
   */
  getById(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new funnel step.
   * @param funnelStepData Data of the funnel step to create.
   * @returns An observable of the created funnel step.
   */
  create(funnelStepData: FunnelStep): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, funnelStepData);
  }

  /**
   * Update an existing funnel step by its ID.
   * @param id Funnel step ID.
   * @param funnelStepData Data to update the funnel step.
   * @returns An observable of the updated funnel step.
   */
  update(id: string, funnelStepData: any): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, funnelStepData);
  }

  /**
   * Perform a step action for a funnel step.
   * @param funnelStepData Data to perform the step action.
   * @returns An observable of the step action result.
   */
  leadStep(funnelStepData: any): Observable<any> {
    return this._http.patch(`${this.baseStepUrl}/lead-step`, funnelStepData);
  }

  /**
   * Delete a funnel step by its ID.
   * @param id Funnel step ID.
   * @returns An observable of the delete result.
   */
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
