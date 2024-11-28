import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BanksComponent} from "@app/views/private/crm/banks/banks/banks.component";

const routes: Routes = [
  {
    path: '',
    component: BanksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanksRoutingModule {
}
