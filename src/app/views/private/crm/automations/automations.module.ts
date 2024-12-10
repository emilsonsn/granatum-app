import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationsRoutingModule } from './automations-routing.module';
import { AutomationsComponent } from './automations/automations.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AutomationsComponent
  ],
  imports: [
    CommonModule,
    AutomationsRoutingModule,
    SharedModule
  ]
})
export class AutomationsModule { }
