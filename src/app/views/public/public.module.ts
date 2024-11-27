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


@NgModule({
  declarations: [
    CandidatingComponent
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
    SharedModule,
    MatButtonModule,
    MatDivider,
    MatOption
  ]
})
export class PublicModule { }
