import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget/budget.component';
import { SharedModule } from '@shared/shared.module';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRipple } from '@angular/material/core';
import { BudgetLayoutComponent } from './budget-layout/budget-layout.component';
import { BudgetGeneratedComponent } from './budget-generated/budget-generated.component';


@NgModule({
  declarations: [
    BudgetComponent,
    BudgetDetailComponent,
    BudgetLayoutComponent,
    BudgetGeneratedComponent
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
