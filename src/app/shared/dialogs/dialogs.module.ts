import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {ComponentsModule} from '@shared/components/components.module';
import {DirectivesModule} from '@shared/directives/directives.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {PipesModule} from '@shared/pipes/pipes.module';
import {DialogConfirmComponent} from './dialog-confirm/dialog-confirm.component';
import {FiltersModule} from './filters/filters.module';
import {DialogOrderComponent} from './dialog-order/dialog-order.component';
import {DialogCollaboratorComponent} from './dialog-collaborator/dialog-collaborator.component';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule} from '@angular/material/core';
import {DialogProviderComponent} from './dialog-provider/dialog-provider.component';
import {NgxMaskDirective, NgxMaskPipe} from 'ngx-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {DialogServiceComponent} from './dialog-service/dialog-service.component';
import {DialogConstructionComponent} from './dialog-construction/dialog-construction.component';
import {DialogClientComponent} from './dialog-client/dialog-client.component';
import {DialogRequestComponent} from './dialog-request/dialog-request.component';
import {DialogTypeProviderComponent} from './dialog-type-provider/dialog-type-provider.component';
import {TablesModule} from '@shared/tables/tables.module';
import {DialogTypeServiceComponent} from './dialog-type-service/dialog-type-service.component';
import {DialogTypeUserSectorComponent} from './dialog-type-user-sector/dialog-type-user-sector.component';
import {DialogTaskComponent} from './dialog-task/dialog-task.component';
import {MatIcon} from "@angular/material/icon";
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {DialogOrderSolicitationComponent} from './dialog-order-solicitation/dialog-order-solicitation.component';
import {DialogLeadsComponent} from './dialog-leads/dialog-leads.component';
import {DialogTravelComponent} from './dialog-travel/dialog-travel.component';
import localePt from '@angular/common/locales/pt';
import {CustomDateAdapter} from "@app/app.module";
import {ACE_CONFIG, AceConfigInterface} from "ngx-ace-wrapper";
import { DialogProfessionComponent } from './dialog-profession/dialog-profession.component';
import { DialogVacancyComponent } from './dialog-vacancy/dialog-vacancy.component';
import { DialogSelectionProcessComponent } from './dialog-selection-process/dialog-selection-process.component';
import { DialogCandidateComponent } from './dialog-candidate/dialog-candidate.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { DialogFunnelComponent } from './dialog-funnel/dialog-funnel.component';
import { DialogBankComponent } from './dialog-bank/dialog-bank.component';
import { DialogPartnerComponent } from './dialog-partner/dialog-partner.component';
import { DialogAutomationsComponent } from './dialog-automations/dialog-automations.component';
import { DialogHrCampaignComponent } from './dialog-hr-campaign/dialog-hr-campaign.component';
import { DialogBudgetComponent } from './dialog-budget/dialog-budget.component';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
  mode: 'json',
  theme: 'dracula',
  wrap: true,
  tabSize: 4,
  showPrintMargin: false,
  fontSize: 12
};

registerLocaleData(localePt, 'pt-BR');

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    DialogConfirmComponent,
    DialogOrderComponent,
    DialogCollaboratorComponent,
    DialogProviderComponent,
    DialogServiceComponent,
    DialogConstructionComponent,
    DialogClientComponent,
    DialogRequestComponent,
    DialogTypeProviderComponent,
    DialogTypeServiceComponent,
    DialogTypeUserSectorComponent,
    DialogTaskComponent,
    DialogOrderSolicitationComponent,
    DialogLeadsComponent,
    DialogTravelComponent,
    DialogLeadsComponent,
    DialogProfessionComponent,
    DialogVacancyComponent,
    DialogSelectionProcessComponent,
    DialogCandidateComponent,
    DialogFunnelComponent,
    DialogBankComponent,
    DialogPartnerComponent,
    DialogAutomationsComponent,
    DialogHrCampaignComponent,
    DialogBudgetComponent
  ],
  imports: [
    CommonModule,
    FiltersModule,
    TablesModule,
    ComponentsModule,
    DirectivesModule,
    ClipboardModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatRippleModule,
    MatTabsModule,
    TextFieldModule,
    CdkTextareaAutosize,
    CurrencyMaskModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMatSelectSearchModule,
    MatIcon,
    
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR'
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }
  ]
})
export class DialogsModule {
}
