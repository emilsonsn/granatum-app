import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { ProfessionsComponent } from './professions/professions.component';
import { VacationsComponent } from './vacations/vacations.component';
import { SelectionProcessComponent } from './selection-process/selection-process.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from '@shared/shared.module';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    ProfessionsComponent,
    VacationsComponent,
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
