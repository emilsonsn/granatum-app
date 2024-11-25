import { RhModule } from './rh.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessionsComponent } from './professions/professions.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { SelectionProcessComponent } from './selection-process/selection-process.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: 'professions',
    component: ProfessionsComponent,
  },
  {
    path: 'vacancies',
    component: VacanciesComponent,
  },
  {
    path: 'selection-process',
    component: SelectionProcessComponent,
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
