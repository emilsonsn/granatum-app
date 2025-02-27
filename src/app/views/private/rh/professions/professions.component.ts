import { Component, computed, Signal, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { DialogProfessionComponent } from '@shared/dialogs/dialog-profession/dialog-profession.component';
import { Profession, ProfessionCards } from '@models/profession';
import { ProfessionService } from '@services/profession.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-professions',
  templateUrl: './professions.component.html',
  styleUrl: './professions.component.scss',
})
export class ProfessionsComponent {
  public filters;
  public loading: boolean = false;
  public formFilters: FormGroup;

  protected dashboardCards = signal<ProfessionCards>({
    totalProfessionsMonth: 0,
    totalProfessions: 0,
  });

  protected itemsRequests: Signal<ISmallInformationCard[]> = computed<
    ISmallInformationCard[]
  >(() => [
    {
      icon: 'fa-solid fa-clock',
      background: '#FC9108',
      title: this.dashboardCards()?.totalProfessionsMonth ?? 0,
      category: 'Profissões',
      description: 'Total de Profissões no Mês',
    },
    {
      icon: 'fa-solid fa-envelope-open',
      icon_description: 'fa-solid fa-calendar-day',
      background: '#17a2b8',
      title: this.dashboardCards()?.totalProfessions ?? 0,
      category: 'Profissões',
      description: 'Total de Profissões',
    },
  ]);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _dialog: MatDialog,
    private readonly _professionService: ProfessionService,
    private readonly _toastr: ToastrService,
    private readonly _fb: FormBuilder,
  ) {
    this._headerService.setTitle('Profissões');
    this._headerService.setSubTitle('');
  }

  ngOnInit() {
    this.getCards();

    this.formFilters = this._fb.group({
      search_term : ''
    });
  }

  public openProfessionDialog(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogProfessionComponent, {
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

  public onDeleteProfession(profession: Profession) {
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
            this.delete(profession.id);
          }
        },
      });
  }

  public delete(id: number) {
    this._initOrStopLoading();

    this._professionService
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
      search_term : ''
    });
    this.updateFilters();
  }

  // Utils
  public _initOrStopLoading() {
    this.loading = !this.loading;
  }

  public getCards() {
    this._professionService.getCards().subscribe((c) => {
      this.dashboardCards.set(c.data);
    });
  }
}
