import { Component, computed, Signal, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';
import { Candidate, CandidateCards } from '@models/candidate';
import { CandidateService } from '@services/candidate.service';
import { DialogCandidateComponent } from '@shared/dialogs/dialog-candidate/dialog-candidate.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Profession } from '@models/profession';
import { ProfessionService } from '@services/profession.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.scss',
})
export class CandidatesComponent {
  public filters;
  public loading: boolean = false;
  public formFilters: FormGroup;
  protected _onDestroy = new Subject<void>();

  protected dashboardCards = signal<CandidateCards>({
    totalCandidates: 0,
    totalCandidatesActive: 0,
    totalCandidatesInactive: 0,
  });

  protected itemsRequests: Signal<ISmallInformationCard[]> = computed<
    ISmallInformationCard[]
  >(() => [
    {
      icon: 'fa-solid fa-check-circle',
      // icon_description: 'fa-solid fa-calendar-day',
      background: '#28a745',
      title: this.dashboardCards()?.totalCandidatesActive ?? 0,
      category: 'Candidatos',
      description: 'Candidatos Ativas',
    },
    {
      icon: 'fa-solid fa-clock',
      background: '#E9423E',
      title: this.dashboardCards()?.totalCandidatesInactive ?? 0,
      category: 'Candidatos',
      description: 'Candidatos Inativas',
    },
    {
      icon: 'fa-solid fa-envelope-open',
      icon_description: 'fa-solid fa-calendar-day',
      background: '#17a2b8',
      title: this.dashboardCards()?.totalCandidates ?? 0,
      category: 'Candidatos',
      description: 'Total de Candidatos no Mês',
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

  protected statusSelect = [
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _dialog: MatDialog,
    private readonly _candidateService: CandidateService,
    private readonly _toastr: ToastrService,
    private readonly _fb: FormBuilder,
    private readonly _professionService: ProfessionService
  ) {
    this._headerService.setTitle('Candidatos');
    this._headerService.setSubTitle('');

    this.getProfessionsFromBack();
  }

  ngOnInit() {
    this.getCards();

    this.formFilters = this._fb.group({
      search_term: '',
      profession_id: '',
      is_active: '',
    });
  }

  public openCandidateDialog(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogCandidateComponent, {
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

  public onDeleteCandidate(candidate: Candidate) {
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
            this.delete(candidate.id);
          }
        },
      });
  }

  public delete(id: number) {
    this._initOrStopLoading();

    this._candidateService
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
      is_active: '',
    });
    this.updateFilters();
  }

  // Utils
  public _initOrStopLoading() {
    this.loading = !this.loading;
  }

  public getCards() {
    this._candidateService.getCards().subscribe((c) => {
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
