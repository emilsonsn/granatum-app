import {Component, computed, Signal} from '@angular/core';
import {ITravel} from "@models/Travel";
import {ISmallInformationCard} from "@models/cardInformation";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogTravelComponent} from "@shared/dialogs/dialog-travel/dialog-travel.component";
import {DialogConfirmComponent} from "@shared/dialogs/dialog-confirm/dialog-confirm.component";
import {TravelService} from "@services/travel/travel.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss'
})
export class TravelComponent {
  loading: boolean;
  filters: any;

  itemsTravel: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-envelope-open',
      // icon_description: 'fa-solid fa-calendar-day',
      // background: '#17a2b8',
      title: "this.cards().solicitationPending",
      category: 'Solicitações em aberto',
      description: 'Solicitações em aberto',
    },
    {
      icon: 'fa-solid fa-calendar-times',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#dc3545',
      title: "this.cards().solicitationReject",
      category: 'Solicitações vencidas',
      description: 'Solicitações vencidas',
    },
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: "this.cards().solicitationFinished",
      category: 'Solicitações resolvidas',
      description: 'Solicitações resolvidas',
    },
  ]);

  constructor(
    private dialog: MatDialog,
    private readonly _travelService: TravelService,
    private readonly _dialog: MatDialog,
    private readonly _toastrService: ToastrService
  ) {
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
