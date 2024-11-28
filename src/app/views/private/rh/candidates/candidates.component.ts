import { Component, computed, Signal, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ISmallInformationCard } from '@models/cardInformation';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Candidate, CandidateCards } from '@models/candidate';
import { CandidateService } from '@services/candidate.service';
import { DialogCandidateComponent } from '@shared/dialogs/dialog-candidate/dialog-candidate.component';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.scss',
})
export class CandidatesComponent {
  public filters;
  public loading: boolean = false;

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

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _dialog: MatDialog,
    private readonly _candidateService: CandidateService,
    private readonly _toastr: ToastrService
  ) {
    this._headerService.setTitle('Candidatos');
    this._headerService.setSubTitle('');
  }

  ngOnInit() {
    this.getCards();
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

  // Utils
  public _initOrStopLoading() {
    this.loading = !this.loading;
  }

  public getCards() {
    this._candidateService.getCards().subscribe((c) => {
      this.dashboardCards.set(c.data);
    });
  }
}
