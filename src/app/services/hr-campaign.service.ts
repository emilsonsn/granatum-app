import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponsePageable, PageControl } from '@models/application';
import { HrCampaign } from '@models/hrCampaign';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HrCampaignService {
  private readonly baseUrl = `${environment.api}/hr-campaign`;

  constructor(private readonly _http: HttpClient) { }

  getHrCampaigns(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<HrCampaign>> {

    return this._http.get<ApiResponsePageable<HrCampaign>>(`${this.baseUrl}/search`);
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
  create(hrCampaignData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, hrCampaignData);
  }

  // Update an existing funnel step
  update(id: string, hrCampaignData: HrCampaign): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}`, hrCampaignData);
  }

  // Delete a funnel step by ID
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
}
