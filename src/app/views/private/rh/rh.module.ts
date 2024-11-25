import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { ProfessionsComponent } from './professions/professions.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { SelectionProcessComponent } from './selection-process/selection-process.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from '@shared/shared.module';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    ProfessionsComponent,
    VacanciesComponent,
    SelectionProcessComponent,
    CandidatesComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule,
    SharedModule,
    MatRippleModule,
  ]
})
export class RhModule { }
