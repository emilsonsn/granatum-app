import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TravelComponent} from "@app/views/private/travels/travel/travel/travel.component";
import { TravelSolicitationComponent } from './travel-solicitation/travel-solicitation.component';

const routes: Routes = [
  {
    path: '',
    component: TravelSolicitationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelSolicitationRoutingModule {
}
