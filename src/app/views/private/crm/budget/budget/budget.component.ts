import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Budget } from '@models/budget';
import { BudgetService } from '@services/crm/budget.service';
import { DialogBudgetComponent } from '@shared/dialogs/dialog-budget/dialog-budget.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss'
})
export class BudgetComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _budgetService: BudgetService,
    private readonly _router: Router,
  ) {
  }

  openOrderFilterDialog() {

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public openBudgetDialog(budget?: Budget) {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogBudgetComponent, {
        data: budget ? { budget:budget} : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            if (res.id) {
              this._patchBudget(res.id, res);
              return;
            }

            this._postBudget(res);
          }
        }
      })
  }

  private _patchBudget(id: number, budgetData: Budget) {
    this._initOrStopLoading();
    this._budgetService.update(id.toString(), budgetData).subscribe({
      next: () => {
        this._toastr.success("Orçamento atualizado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao atualizar o orçamento.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  private _postBudget(res: any) {
    this._initOrStopLoading();
    this._budgetService.create(res).subscribe({
      next: () => {
        this._toastr.success("Orçamento criado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao criar o orçamento.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  onDeleteBudget(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteBudget(id);
        }
      });
  }

  private _deleteBudget(id: number) {
    this._initOrStopLoading();
    this._budgetService
      .delete(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  public redirectForBudgetDetail(id: number){
    this._router.navigate([`/painel/crm/budget/detail/${id}`])
    
  }
}

