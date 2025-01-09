import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatingComponent } from './candidating/candidating.component';
import { LeadsComponent } from './leads/leads.component';

const routes: Routes = [
  {
    path: 'vaga',
    component: CandidatingComponent
  },
  {
    path: 'leads',
    component: LeadsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
