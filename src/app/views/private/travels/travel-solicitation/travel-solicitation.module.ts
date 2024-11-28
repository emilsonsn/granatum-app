import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ComponentsModule} from "@shared/components/components.module";
import {MatRipple} from "@angular/material/core";
import {TablesModule} from "@shared/tables/tables.module";
import { TravelSolicitationRoutingModule } from './travel-solicitation-routing.module';
import { TravelSolicitationComponent } from './travel-solicitation/travel-solicitation.component';


@NgModule({
  declarations: [
    TravelSolicitationComponent
  ],
  imports: [
    CommonModule,
    TravelSolicitationRoutingModule,
    ComponentsModule,
    MatRipple,
    TablesModule
  ]
})
export class TravelSolicitationModule { }
