import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads/leads.component';
import {SharedModule} from "@shared/shared.module";
import {MatRipple} from "@angular/material/core";


@NgModule({
  declarations: [
    LeadsComponent
  ],
  imports: [
    CommonModule,
    LeadsRoutingModule,
    SharedModule,
    MatRipple
  ]
})
export class LeadsModule { }
