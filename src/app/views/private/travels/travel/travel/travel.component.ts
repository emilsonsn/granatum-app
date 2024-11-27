import {Component, computed, signal, Signal} from '@angular/core';
import {ITravel, ITravelCard} from "@models/Travel";
import {ISmallInformationCard} from "@models/cardInformation";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogTravelComponent} from "@shared/dialogs/dialog-travel/dialog-travel.component";
import {DialogConfirmComponent} from "@shared/dialogs/dialog-confirm/dialog-confirm.component";
import {TravelService} from "@services/travel/travel.service";
import {ToastrService} from "ngx-toastr";
import {ApiResponse} from "@models/application";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss'
})
export class TravelComponent {
  loading: boolean;
  filters: any;

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

  itemsTravel: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-plane-circle-exclamation',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#FBAB27',
      title: this.dashboardCards().pendingTravels.toString(),
      category: 'Viagens pendentes',
      description: 'Viagens pendentes',
    },
    {
      icon: 'fa-solid fa-plane-departure',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#356fdc',
      title: this.dashboardCards().totalValueTravels.toString(),
      category: 'Viagens Totais',
      description: 'Viagens Totais',
    },
    {
      icon: 'fa-solid fa-plane-circle-check',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.dashboardCards().resolvedTravels.toString(),
      category: 'Viagens resolvidas',
      description: 'Viagens resolvidas',
    },
  ]);

  constructor(
    private dialog: MatDialog,
    private readonly _travelService: TravelService,
    private readonly _dialog: MatDialog,
    private readonly _toastrService: ToastrService
  ) {
    _travelService.getCards().subscribe((c: ApiResponse<ITravelCard>) => {
      this.dashboardCards.set(c.data);
    })
  }

  openRequestDialog($event?: ITravel) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this.dialog.open(DialogTravelComponent, {
      data: $event ? {...$event} : null,
      ...dialogConfig
    }).afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 200);
          }
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

  onOrderModal($event: ITravel) {

  }

  openOrderFilterDialog() {

  }

}
