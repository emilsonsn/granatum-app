import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads/leads.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatRipple} from "@angular/material/core";
import {SharedModule} from "@shared/shared.module";
import { KanbanLeadComponent } from './kanban-lead/kanban-lead.component';
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    LeadsComponent,
    KanbanLeadComponent
  ],
  imports: [
    CommonModule,
    LeadsRoutingModule,
    MatTabsModule,
    MatRipple,
    SharedModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CdkDragPlaceholder
  ]
})
export class LeadsModule { }
