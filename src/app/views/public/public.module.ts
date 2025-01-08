import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { CandidatingComponent } from './candidating/candidating.component';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeadsComponent } from './leads/leads.component';
import { MatSpinner } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    CandidatingComponent,
    LeadsComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,
    SharedModule,
    MatButtonModule,
    MatDivider,
    MatOption,
    MatSpinner
  ]
})
export class PublicModule { }
