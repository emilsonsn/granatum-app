import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BudgetComponent} from "@app/views/private/crm/budget/budget/budget.component";
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetComponent
  },
  {
    path: 'budget-detail',
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
