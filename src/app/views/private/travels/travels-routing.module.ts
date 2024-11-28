import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./travel/travel.module').then(m => m.TravelModule)
  },
  {
    path: "dashboard",
    loadChildren: () => import('./travel-dashboard/travel-dashboard.module').then(m => m.TravelDashboardModule)
  },
  {
    path: "solicitation",
    loadChildren: () => import('./travel-solicitation/travel-solicitation.module').then(m => m.TravelSolicitationModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelsRoutingModule {
}
