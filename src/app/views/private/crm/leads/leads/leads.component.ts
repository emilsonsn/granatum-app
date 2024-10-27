import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogLeadsComponent} from "@shared/dialogs/dialog-leads/dialog-leads.component";
import {ToastrService} from "ngx-toastr";
import {LeadService} from "@services/crm/lead.service";
import {Lead} from "@models/Lead";
import {DialogConfirmComponent} from "@shared/dialogs/dialog-confirm/dialog-confirm.component";
import {finalize} from "rxjs";

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss'
})
export class LeadsComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _leadService: LeadService
  ) {
  }

  openOrderFilterDialog() {

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public openLeadsDialog(lead?: Lead) {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogLeadsComponent, {
        data: lead ? {...lead} : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            const id = +res.get('id');
            if (id) {
              this._patchLeads(id, res.value);
              return;
            }

            this._postLeads(res);
          }
        }
      })
  }

  private _patchLeads(id: number, leadData: any) {
    this._initOrStopLoading();
    this._leadService.update(id.toString(), leadData).subscribe({
      next: () => {
        this._toastr.success("Lead atualizado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao atualizar o lead.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  private _postLeads(res: any) {
    this._initOrStopLoading();
    this._leadService.create(res).subscribe({
      next: () => {
        this._toastr.success("Lead criado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao criar o lead.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  onDeleteLead(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteLead(id);
        }
      });
  }

  private _deleteLead(id: number) {
    this._initOrStopLoading();
    this._leadService
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
