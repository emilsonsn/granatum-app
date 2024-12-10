import { Component, computed, Signal, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize, map, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Vacancy, VacancyCards } from '@models/vacancy';
import { VacancyService } from '@services/vacancy.service';
import { DialogVacancyComponent } from '@shared/dialogs/dialog-vacancy/dialog-vacancy.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Profession } from '@models/profession';
import { ProfessionService } from '@services/profession.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss',
})
export class VacanciesComponent {
  public filters;
  public formFilters: FormGroup;
  public loading: boolean = false;
  protected _onDestroy = new Subject<void>();

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

  // Selects
  protected professionSelect: Profession[] = [];
  protected professionCtrl: FormControl<any> = new FormControl<any>(null);
  protected professionFilterCtrl: FormControl<any> = new FormControl<string>(
    ''
  );
  protected filteredProfessions: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _dialog: MatDialog,
    private readonly _vacancyService: VacancyService,
    private readonly _toastr: ToastrService,
    private readonly _fb: FormBuilder,
    private readonly _professionService : ProfessionService,
  ) {
    this._headerService.setTitle('Vagas');
    this._headerService.setSubTitle('');

    this.getProfessionsFromBack();
  }

  ngOnInit() {
    this.getCards();

    this.formFilters = this._fb.group({
      search_term: '',
      profession_id: '',
    });
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

  // Filters
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      search_term: '',
      profession_id: '',
    });
    this.updateFilters();
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

  // Selects
  protected prepareFilterProfessionCtrl() {
    this.professionFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.professionSelect.slice();
          } else {
            search = search.toLowerCase();
            return this.professionSelect.filter((profession) =>
              profession.title.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredProfessions.next(filtered);
      });
  }

  public clearProfessionId() {
    this.formFilters.get('profession_id').patchValue('');
  }

  // Getters
  public getProfessionsFromBack() {
    this._professionService.getList().subscribe((res) => {
      this.professionSelect = res.data;

      this.filteredProfessions.next(this.professionSelect.slice());
      this.prepareFilterProfessionCtrl();
    });
  }
}
