import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads/leads.component';
import {MatRipple} from "@angular/material/core";
import {SharedModule} from "@shared/shared.module";


@NgModule({
  declarations: [
    LeadsComponent
  ],
  imports: [
    CommonModule,
    LeadsRoutingModule,
    MatRipple,
    SharedModule
  ]
})
export class LeadsModule { }
