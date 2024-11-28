import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'leads',
    loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule)
  },
  {
    path: 'automations',
    loadChildren: () => import('./automations/automations.module').then(m => m.AutomationsModule)
  },
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule)
  },
  {
    path: 'banks',
    loadChildren: () => import('./banks/banks.module').then(m => m.BanksModule)
  },
  {
    path: 'partners',
    loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule)
  },
  {
    path: 'web-chat',
    loadChildren: () => import('./web-chat/web-chat.module').then(m => m.WebChatModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule {
}
