import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelDashboardRoutingModule } from './travel-dashboard-routing.module';
import { TravelDashboardComponent } from './travel-dashboard/travel-dashboard.component';


@NgModule({
  declarations: [
    TravelDashboardComponent
  ],
  imports: [
    CommonModule,
    TravelDashboardRoutingModule
  ]
})
export class TravelDashboardModule { }
