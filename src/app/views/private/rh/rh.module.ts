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
import { SelectionProcessKanbanComponent } from './selection-process-kanban/selection-process-kanban.component';
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    ProfessionsComponent,
    VacanciesComponent,
    SelectionProcessComponent,
    CandidatesComponent,
    ChatComponent,
    SelectionProcessKanbanComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRippleModule,
    NgxMatSelectSearchModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CdkDragPlaceholder,
  ]
})
export class RhModule { }
