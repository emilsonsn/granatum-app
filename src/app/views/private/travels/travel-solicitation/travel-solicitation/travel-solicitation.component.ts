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
  selector: 'app-travel-solicitation',
  templateUrl: './travel-solicitation.component.html',
  styleUrl: './travel-solicitation.component.scss'
})
export class TravelSolicitationComponent {
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

  constructor(
    private dialog: MatDialog,
    private readonly _travelService: TravelService,
    private readonly _dialog: MatDialog,
    private readonly _toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.filters = {
      purchase_status: 'RequestFinance'
    }
    
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
