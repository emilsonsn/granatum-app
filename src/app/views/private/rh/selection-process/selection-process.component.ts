import { Component, computed, Signal, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { SelectionProcess, SelectionProcessCards } from '@models/selectionProccess';
import { SelectionProcessService } from '@services/selection-process.service';
import { DialogSelectionProcessComponent } from '@shared/dialogs/dialog-selection-process/dialog-selection-process.component';

@Component({
  selector: 'app-selection-process',
  templateUrl: './selection-process.component.html',
  styleUrl: './selection-process.component.scss',
})
export class SelectionProcessComponent {
  public filters;
  public loading: boolean = false;

  protected dashboardCards = signal<SelectionProcessCards>({
    activeSelectionProcesss: 0,
    inactiveSelectionProcesss: 0,
    totalSelectionProcesssMonth: 0,
  });

  protected itemsRequests: Signal<ISmallInformationCard[]> = computed<
    ISmallInformationCard[]
  >(() => [
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.dashboardCards()?.activeSelectionProcesss ?? 0,
      category: 'Processos Seletivos',
      description: 'Processos Seletivos Ativas',
    },
    {
      icon: 'fa-solid fa-clock',
      background: '#E9423E',
      title: this.dashboardCards()?.inactiveSelectionProcesss ?? 0,
      category: 'Processos Seletivos',
      description: 'Processos Seletivos Inativas',
    },
    {
      icon: 'fa-solid fa-envelope-open',
      icon_description: 'fa-solid fa-calendar-day',
      background: '#17a2b8',
      title: this.dashboardCards()?.totalSelectionProcesssMonth ?? 0,
      category: 'Processos Seletivos',
      description: 'Total de Processos Seletivos no Mês',
    },
  ]);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _selectionProcessService : SelectionProcessService,
  ) {
    this._headerService.setTitle('Processos Seletivos');
    this._headerService.setSubTitle('');
  }

  ngOnInit() {
    this.getCards();
  }

  public openSelectionProcessDialog(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogSelectionProcessComponent, {
        data: data ? { ...data } : null,
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.getCards();
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 300);
          }
        },
      });
  }

  public onDeleteSelectionProcess(selectionProcess: SelectionProcess) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: { text: `Tem certeza? Essa ação não pode ser revertida!` },
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this.delete(selectionProcess.id);
          }
        },
      });
  }

  public delete(id: number) {
    this._initOrStopLoading();

    this._selectionProcessService
      .delete(id)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Utils
  public _initOrStopLoading() {
    this.loading = !this.loading;
  }

  public getCards() {
    this._selectionProcessService.getCards().subscribe((c) => {
      this.dashboardCards.set(c.data);
    });
  }
}
