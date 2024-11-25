import { RhModule } from './rh.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessionsComponent } from './professions/professions.component';

const routes: Routes = [
  {
    path: 'professions',
    component: ProfessionsComponent,
  },
  {
    path: 'vacations',
    component: ProfessionsComponent,
  },
  {
    path: 'selection-process',
    component: ProfessionsComponent,
  },
  {
    path: 'candidates',
    component: ProfessionsComponent,
  },
  {
    path: 'chat',
    component: ProfessionsComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
