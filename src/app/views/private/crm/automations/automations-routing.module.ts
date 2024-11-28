import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AutomationsComponent} from "@app/views/private/crm/automations/automations/automations.component";

const routes: Routes = [
  {
    path: '',
    component: AutomationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationsRoutingModule { }
