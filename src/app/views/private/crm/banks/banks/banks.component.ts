import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Bank } from '@models/bank';
import { BankService } from '@services/crm/bank.service';
import { DialogBankComponent } from '@shared/dialogs/dialog-bank/dialog-bank.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss'
})
export class BanksComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _bankService: BankService,
  ) {
  }

  openOrderFilterDialog() {

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public openBanksDialog(bank?: Bank) {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogBankComponent, {
        data: bank ? { bank:bank} : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            if (res.get('id') != 'null') {
              this._patchBanks(res.get('id'), res);
              return;
            }

            this._postBanks(res);
          }
        }
      })
  }

  private _patchBanks(id: number, leadData: Bank) {
    this._initOrStopLoading();
    this._bankService.update(id.toString(), leadData).subscribe({
      next: () => {
        this._toastr.success("Banco atualizado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao atualizar o banco.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  private _postBanks(res: any) {
    this._initOrStopLoading();
    this._bankService.create(res).subscribe({
      next: () => {
        this._toastr.success("Banco criado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao criar o banco.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  onDeleteBank(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteBank(id);
        }
      });
  }

  private _deleteBank(id: number) {
    this._initOrStopLoading();
    this._bankService
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
}

