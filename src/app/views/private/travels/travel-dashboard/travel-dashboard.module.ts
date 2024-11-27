import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelDashboardRoutingModule } from './travel-dashboard-routing.module';
import { TravelDashboardComponent } from './travel-dashboard/travel-dashboard.component';
import {SharedModule} from "@shared/shared.module";
import {MatDivider} from "@angular/material/divider";


@NgModule({
  declarations: [
    TravelDashboardComponent
  ],
  imports: [
    CommonModule,
    TravelDashboardRoutingModule,
    SharedModule,
    MatDivider
  ]
})
export class TravelDashboardModule { }
