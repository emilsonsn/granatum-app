import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconButton } from "@angular/material/button";
import { TableOrdersComponent } from './table-orders/table-orders.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import { TableProviderComponent } from './table-provider/table-provider.component';
import { TableServiceComponent } from './table-service/table-service.component';
import { TableConstructionComponent } from './table-construction/table-construction.component';
import { TableClientComponent } from './table-client/table-client.component';
import { TableRequestComponent } from './table-request/table-request.component';
import { TableTypeProviderComponent } from './table-type-provider/table-type-provider.component';
import { TableTypeServiceComponent } from './table-type-service/table-type-service.component';
import { TableTypeUserSectorComponent } from './table-type-user-sector/table-type-user-sector.component';
import { TableUserComponent } from './table-users/table-users.component';
import {SharedModule} from "@shared/shared.module";
import {AvatarModule} from "@shared/components/avatar/avatar.module";
import { TableLeadsComponent } from './table-leads/table-leads.component';
import { TableTravelComponent } from './table-travel/table-travel.component';
import { TableProfessionsComponent } from './table-professions/table-professions.component';
import { TableCandidatesComponent } from './table-candidates/table-candidates.component';
import { TableVacanciesComponent } from './table-vacancies/table-vacancies.component';
import { TableSelectionProcessComponent } from './table-selection-processes/table-selection-processes';
import { TableFunnelComponent } from './table-funnel/table-funnel.component';
import {MatTooltip} from "@angular/material/tooltip";

const tables = [
  TableOrdersComponent,
  TableProviderComponent,
  TableServiceComponent,
  TableClientComponent,
  TableConstructionComponent,
  TableRequestComponent,
  TableTypeProviderComponent,
  TableTypeProviderComponent,
  TableTypeServiceComponent,
  TableUserComponent,
  TableTypeUserSectorComponent,
  TableLeadsComponent,
  TableTravelComponent,
  TableProfessionsComponent,
  TableVacanciesComponent,
  TableCandidatesComponent,
  TableSelectionProcessComponent,
  TableFunnelComponent
]

@NgModule({
  declarations: [
    tables,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconButton,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    PipesModule,
    AvatarModule,
    MatTooltip,
  ],
  exports: [
    tables,
  ],
})
export class TablesModule { }
