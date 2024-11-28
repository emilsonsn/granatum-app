import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  TravelDashboardComponent
} from "@app/views/private/travels/travel-dashboard/travel-dashboard/travel-dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: TravelDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelDashboardRoutingModule {
}
