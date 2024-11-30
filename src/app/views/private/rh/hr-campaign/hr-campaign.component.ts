import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HrCampaign } from '@models/hrCampaign';
import { HrCampaignService } from '@services/hr-campaign.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogHrCampaignComponent } from '@shared/dialogs/dialog-hr-campaign/dialog-hr-campaign.component';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-hr-campaign',
  templateUrl: './hr-campaign.component.html',
  styleUrl: './hr-campaign.component.scss'
})
export class HrCampaignComponent {
  public loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _hrCampaignService: HrCampaignService,
  ) {
  }

  openOrderFilterDialog() {

  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public openHrCampaignDialog(hrCampaign?: HrCampaign) {

    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogHrCampaignComponent, {
        data: hrCampaign ? { hrCampaign:hrCampaign} : null,
        ...dialogConfig
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            if (res.id) {
              this._patchHrCampaign(res.id, {
                ...res,
                start_date: dayjs(res.start_date).format('YYYY-MM-DD HH:mm:ss'),
              });
              return;
            }

            this._postHrCampaign({
              ...res,
              start_date: dayjs(res.start_date).format('YYYY-MM-DD HH:mm:ss'),
            });
          }
        }
      })
  }

  private _patchHrCampaign(id: number, hrCampaignData: HrCampaign) {
    this._initOrStopLoading();
    this._hrCampaignService.update(id.toString(), hrCampaignData).subscribe({
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

  private _postHrCampaign(res: any) {
    this._initOrStopLoading();
    this._hrCampaignService.create(res).subscribe({
      next: () => {
        this._toastr.success("Campanha criada com sucesso!");
        this._initOrStopLoading();
      },
      error: (error) => {
        this._toastr.error("Erro ao criar a campanha.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

  onDeleteHrCampaign(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteHrCampaign(id);
        }
      });
  }

  private _deleteHrCampaign(id: number) {
    this._initOrStopLoading();
    this._hrCampaignService
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

