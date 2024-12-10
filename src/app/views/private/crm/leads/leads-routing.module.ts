import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeadsComponent} from "@app/views/private/crm/leads/leads/leads.component";
import { KanbanLeadComponent } from './kanban-lead/kanban-lead.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsComponent
  },
  {
    path: 'kanban/:id',
    component: KanbanLeadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule {
}
