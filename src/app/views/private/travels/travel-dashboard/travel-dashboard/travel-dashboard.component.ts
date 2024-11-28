import {Component, computed, Signal, signal} from '@angular/core';
import {OrderData} from "@models/dashboard";
import {DashboardService} from "@services/dashboard.service";
import {ApiResponse} from "@models/application";
import {ISmallInformationCard} from "@models/cardInformation";
import {formatCurrency} from "@angular/common";
import dayjs from "dayjs";
import {RequestOrderStatus} from "@models/requestOrder";
import {TravelService} from "@services/travel/travel.service";
import {ITravel, ITravelCard} from "@models/Travel";
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogTravelComponent } from '@shared/dialogs/dialog-travel/dialog-travel.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-travel-dashboard',
  templateUrl: './travel-dashboard.component.html',
  styleUrl: './travel-dashboard.component.scss'
})
export class TravelDashboardComponent {

  dashboardCards = signal<ITravelCard>(
    {
      pendingTravels: 0,
      resolvedTravels: 0,
      totalValueTravels: 0,
      totalValueMonthTravelsSum: 0,
      pendingMonthTravelsSum: 0,
      resolvedMonthTravelsSum: 0,
    }
  );

  constructor(
    private readonly _dashboardService: DashboardService,
    private readonly _travelService: TravelService,
    private readonly _dialog : MatDialog,
    private readonly _toastrService: ToastrService
  ) {

    _travelService.getCards().subscribe((c: ApiResponse<ITravelCard>) => {
      this.dashboardCards.set(c.data);
    })
  }

  itemsShopping: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-plane-departure',
      icon_description: 'fa-solid fa-calendar-day',
      background: '#FC9108',
      title: formatCurrency(+this.dashboardCards().totalValueMonthTravelsSum.toString(), 'pt-BR', 'R$'),
      category: 'Viagens',
      description: 'Total de gastos do mês',
    },
    {
      icon: 'fa-solid fa-plane-circle-exclamation',
      icon_description: 'fa-regular fa-calendar',
      background: '#E9423E',
      title: formatCurrency(+this.dashboardCards().pendingMonthTravelsSum.toString(), 'pt-BR', 'R$'),
      category: 'Viagens',
      description: 'Total de viagens pendentes',
    },
    {
      icon: 'fa-solid fa-plane-circle-check',
      icon_description: 'fa-solid fa-calendar-week',
      background: '#4CA750',
      title: formatCurrency(+this.dashboardCards().resolvedMonthTravelsSum.toString(), 'pt-BR', 'R$'),
      category: 'Viagens',
      description: 'Total de viagens pagas',
    }
  ]);

  filtersDay: any = {
    date_from: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    date_to: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    purchase_status: RequestOrderStatus.Pending
  };

  filtersMonth: any = {
    purchase_status: RequestOrderStatus.Pending
  };

  loading: boolean = false;


  openRequestDialog($event?: ITravel) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogTravelComponent, {
      data: $event ? {...$event} : null,
      ...dialogConfig
    }).afterClosed()
      .subscribe({
        next: (res) => {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
          
        }
      });
  }

  deleteDialog($event: ITravel) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: {text: `Tem certeza? Essa ação não pode ser revertida!`},
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
          next: (res) => {
            if (res) {
              this._travelService.delete($event.id).subscribe({
                next: (resData) => {
                  this.loading = true;
                  this._toastrService.success(resData.message);
                  setTimeout(() => {
                    this.loading = false;
                  }, 200);
                }
              });
            }
          }
        }
      )
  }

}
