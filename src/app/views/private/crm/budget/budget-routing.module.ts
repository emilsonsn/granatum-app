import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BudgetComponent} from "@app/views/private/crm/budget/budget/budget.component";
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { BudgetLayoutComponent } from './budget-layout/budget-layout.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetLayoutComponent
  },
  {
    path: 'detail/:id',
    component: BudgetDetailComponent
  },
  {
    path: 'generate-budget/:id',
    component: BudgetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule {
}
