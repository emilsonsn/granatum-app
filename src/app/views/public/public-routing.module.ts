import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatingComponent } from './candidating/candidating.component';

const routes: Routes = [
  {
    path: 'vaga',
    component: CandidatingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
