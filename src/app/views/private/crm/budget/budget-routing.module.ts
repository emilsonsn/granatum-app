import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BudgetComponent} from "@app/views/private/crm/budget/budget/budget.component";

const routes: Routes = [
  {
    path: '',
    component: BudgetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule {
}
