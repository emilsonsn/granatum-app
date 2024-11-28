import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanksRoutingModule } from './banks-routing.module';
import { BanksComponent } from './banks/banks.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    BanksComponent
  ],
  imports: [
    CommonModule,
    BanksRoutingModule,
    SharedModule
  ]
})
export class BanksModule { }
