import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget/budget.component';
import { SharedModule } from '@shared/shared.module';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRipple } from '@angular/material/core';


@NgModule({
  declarations: [
    BudgetComponent,
    BudgetDetailComponent
  ],
  imports: [
    CommonModule,
    BudgetRoutingModule,
    SharedModule,
    MatTabsModule,
    MatRipple
  ]
})
export class BudgetModule { }
