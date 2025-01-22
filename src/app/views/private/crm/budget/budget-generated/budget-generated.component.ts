import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetGenerated } from '@models/budget';
import { BudgetGeneratedService } from 'src/app/services/crm/budget_generated.service';

 // ✅ Importação correta do serviço
import { DialogBudgetGeneratedComponent } from '@shared/dialogs/dialog-budget-generated/dialog-budget-generated.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Budget } from '@models/budget'; // ✅ Importação do modelo correto


@Component({
  selector: 'app-budget-generated',
  templateUrl: './budget-generated.component.html',
  styleUrl: './budget-generated.component.scss'
})
export class BudgetGeneratedComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _budgetGeneratedService: BudgetGeneratedService, // ✅ Serviço injetado corretamente
    private readonly _router: Router
  ) {}

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public openBudgetDialog(budgetGenerated?: BudgetGenerated) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
      data: budgetGenerated ? { budgetGenerated } : null
    };

    this._dialog.open(DialogBudgetGeneratedComponent, dialogConfig)
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
      });
  }

  private _patchBudget(id: number, budgetData: BudgetGenerated) {
    this._initOrStopLoading();
  
    // Criar um objeto `Budget` a partir de `BudgetGenerated`
    const budget: Budget = {
      id: budgetData.id,
      title: budgetData.budget?.title || 'Sem título', // Pegando o título do orçamento original
      description: budgetData.description
    };
  
    this._budgetGeneratedService.update(id.toString(), budget).subscribe({
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
    this._budgetGeneratedService.create(res).subscribe({
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
    this._budgetGeneratedService
      .delete(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        }
      });
  }

  public redirectForBudgetDetail(id: number) {
    this._router.navigate([`/painel/crm/budget-generated/detail/${id}`]);
  }
}
