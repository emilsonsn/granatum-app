import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TravelComponent} from "@app/views/private/travels/travel/travel/travel.component";

const routes: Routes = [
  {
    path: '',
    component: TravelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelRoutingModule {
}
