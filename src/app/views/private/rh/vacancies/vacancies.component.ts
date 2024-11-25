import { Component, computed, Signal, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Vacancy, VacancyCards } from '@models/vacancy';
import { VacancyService } from '@services/vacancy.service';
import { DialogVacancyComponent } from '@shared/dialogs/dialog-vacancy/dialog-vacancy.component';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss',
})
export class VacanciesComponent {
  public filters;
  public loading: boolean = false;

  protected dashboardCards = signal<VacancyCards>({
    activeVacancys: 0,
    inactiveVacancys: 0,
    totalVacancysMonth: 0,
  });

  protected itemsRequests: Signal<ISmallInformationCard[]> = computed<
    ISmallInformationCard[]
  >(() => [
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.dashboardCards()?.activeVacancys ?? 0,
      category: 'Vagas',
      description: 'Vagas Ativas',
    },
    {
      icon: 'fa-solid fa-clock',
      background: '#E9423E',
      title: this.dashboardCards()?.inactiveVacancys ?? 0,
      category: 'Vagas',
      description: 'Vagas Inativas',
    },
    {
      icon: 'fa-solid fa-envelope-open',
      icon_description: 'fa-solid fa-calendar-day',
      background: '#17a2b8',
      title: this.dashboardCards()?.totalVacancysMonth ?? 0,
      category: 'Vagas',
      description: 'Total de Vagas no Mês',
    },
  ]);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _dialog: MatDialog,
    private readonly _vacancyService: VacancyService,
    private readonly _toastr: ToastrService
  ) {
    this._headerService.setTitle('Profissões');
    this._headerService.setSubTitle('');
  }

  ngOnInit() {
    this.getCards();
  }

  public openVacancyDialog(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogVacancyComponent, {
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

  public onDeleteVacancy(vacancy: Vacancy) {
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
            this.delete(vacancy.id);
          }
        },
      });
  }

  public delete(id: number) {
    this._initOrStopLoading();

    this._vacancyService
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
    this._vacancyService.getCards().subscribe((c) => {
      this.dashboardCards.set(c.data);
    });
  }
}
