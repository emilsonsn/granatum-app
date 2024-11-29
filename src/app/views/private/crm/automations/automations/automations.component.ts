import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Automations } from '@models/automations';
import { AutomationsService } from '@services/crm/automations.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DiaogAutomationsComponent } from '@shared/dialogs/diaog-automations/diaog-automations.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-automations',
  templateUrl: './automations.component.html',
  styleUrl: './automations.component.scss'
})
export class AutomationsComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _automationsService: AutomationsService,
  ) {
  }

  openOrderFilterDialog() {

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public openAutomationDialog(automations?: Automations) {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DiaogAutomationsComponent, {
        data: automations ? { automations:automations} : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            if (res.get('id') != 'null') {
              this._patchAutomation(res.get('id'), res);
              return;
            }

            this._postAutomation(res);
          }
        }
      })
  }

  private _patchAutomation(id: number, leadData: Automations) {
    this._initOrStopLoading();
    this._automationsService.update(id.toString(), leadData).subscribe({
      next: () => {
        this._toastr.success("Automação atualizada com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao atualizar a automação.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  private _postAutomation(res: any) {
    this._initOrStopLoading();
    this._automationsService.create(res).subscribe({
      next: () => {
        this._toastr.success("Automação criada com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao criar a Automação.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  onDeleteAutomation(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteAutomation(id);
        }
      });
  }

  private _deleteAutomation(id: number) {
    this._initOrStopLoading();
    this._automationsService
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

