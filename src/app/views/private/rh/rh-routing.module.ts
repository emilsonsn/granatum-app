import { RhModule } from './rh.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessionsComponent } from './professions/professions.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { SelectionProcessComponent } from './selection-process/selection-process.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { ChatComponent } from './chat/chat.component';
import {
  SelectionProcessKanbanComponent
} from "@app/views/private/rh/selection-process-kanban/selection-process-kanban.component";
import { HrCampaignComponent } from './hr-campaign/hr-campaign.component';

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
    path: 'selection-process/kanban/:id',
    component: SelectionProcessKanbanComponent,
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
  },
  {
    path: 'hr-campaign',
    component: HrCampaignComponent
  },
  {
    path: 'web-chat',
    loadChildren: () => import('@app/views/private/crm/web-chat/web-chat.module').then(m => m.WebChatModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
