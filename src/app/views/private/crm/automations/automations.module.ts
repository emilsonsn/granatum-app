import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationsRoutingModule } from './automations-routing.module';
import { AutomationsComponent } from './automations/automations.component';


@NgModule({
  declarations: [
    AutomationsComponent
  ],
  imports: [
    CommonModule,
    AutomationsRoutingModule
  ]
})
export class AutomationsModule { }
