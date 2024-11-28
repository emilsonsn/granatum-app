import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelRoutingModule } from './travel-routing.module';
import { TravelComponent } from './travel/travel.component';
import {ComponentsModule} from "@shared/components/components.module";
import {MatRipple} from "@angular/material/core";
import {TablesModule} from "@shared/tables/tables.module";


@NgModule({
  declarations: [
    TravelComponent
  ],
  imports: [
    CommonModule,
    TravelRoutingModule,
    ComponentsModule,
    MatRipple,
    TablesModule
  ]
})
export class TravelModule { }
