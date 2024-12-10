import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Partner } from '@models/partner';
import { PartnersService } from '@services/crm/partners.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogPartnerComponent } from '@shared/dialogs/dialog-partner/dialog-partner.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _partnerService: PartnersService,
  ) {
  }

  openOrderFilterDialog() {

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public openPartnerDialog(partner?: Partner) {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogPartnerComponent, {
        data: partner ? { partner:partner} : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            const id = +res.get('id');
            if (id) {
              this._patchPartners(id, res);
              return;
            }

            this._postPartners(res);
          }
        }
      })
  }

  private _patchPartners(id: number, leadData: Partner) {
    this._initOrStopLoading();
    this._partnerService.update(id.toString(), leadData).subscribe({
      next: () => {
        this._toastr.success("Parceiro atualizado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao atualizar o parceiro.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  private _postPartners(res: any) {
    this._initOrStopLoading();
    this._partnerService.create(res).subscribe({
      next: () => {
        this._toastr.success("Parceiro criado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao criar o parceiro.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  onDeletePartner(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deletePartner(id);
        }
      });
  }

  private _deletePartner(id: number) {
    this._initOrStopLoading();
    this._partnerService
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
