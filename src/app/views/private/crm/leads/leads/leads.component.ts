import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogLeadsComponent} from "@shared/dialogs/dialog-leads/dialog-leads.component";
import {ToastrService} from "ngx-toastr";
import {LeadService} from "@services/crm/lead.service";
import {Lead} from "@models/Lead";
import {DialogConfirmComponent} from "@shared/dialogs/dialog-confirm/dialog-confirm.component";
import {finalize} from "rxjs";
import { Kanban } from '@models/Kanban';
import { DialogFunnelComponent } from '@shared/dialogs/dialog-funnel/dialog-funnel.component';
import { FunnelService } from '@services/crm/funnel.service';
import { Funnel } from '@models/Funnel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss'
})
export class LeadsComponent {
  public loading: boolean = false;
  data: Kanban<Lead> = {};
  // funnel: Funnel[] = [];

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _leadService: LeadService,
    private readonly _funnelService: FunnelService,
    private readonly _router: Router,
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

  // funnel

  public openFunnelDialog(funnel?: Funnel) {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };
    this._dialog
      .open(DialogFunnelComponent, {
        data: funnel ? { funnel: funnel } : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            if (res.id != null) {
              this._patchFunnel(res.id, res.value);
              return;
            }

            this._postFunnel(res);
          }
        }
      })
  }

  private _patchFunnel(id: number, funnelData: any) {
    this._initOrStopLoading();
    this._funnelService.update(id.toString(), funnelData).subscribe({
      next: () => {
        this._toastr.success("funil atualizado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao atualizar funil.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  private _postFunnel(res: any) {
    this._initOrStopLoading();
    this._funnelService.create(res).subscribe({
      next: () => {
        this._toastr.success("funil criado com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao criar funil.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  onDeleteFunnel(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteFunnel(id);
        }
      });
  }

  private _deleteFunnel(id: number) {
    this._initOrStopLoading();
    this._funnelService
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

  public goKanban(id: number){
    this._router.navigate([`/painel/crm/leads/kanban/${id}`])
  }
}
