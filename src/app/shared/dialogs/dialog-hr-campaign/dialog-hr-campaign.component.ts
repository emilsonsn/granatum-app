import { filter, finalize } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HrCampaign, HrCampaignChannels, HrCampaignRecurrenceType, HrCampaignType } from '@models/hrCampaign';
import { SelectionProcessService } from '@services/selection-process.service';
import { SelectionProcess } from '@models/selectionProccess';

@Component({
  selector: 'app-dialog-hr-campaign',
  templateUrl: './dialog-hr-campaign.component.html',
  styleUrl: './dialog-hr-campaign.component.scss'
})
export class DialogHrCampaignComponent {

  public isNewHrCampaign: boolean = true;
  public title: string = 'Nova campanha';

  public form: FormGroup;

  public loading : boolean = false;
  public hrCampaignType = Object.entries(HrCampaignType);
  public hrCampaignTypeEnum = HrCampaignType;
  public hrCampaignRecurrenceType = Object.entries(HrCampaignRecurrenceType);
  public hrCampaignChannels = Object.entries(HrCampaignChannels);
  public selectionProcesses: SelectionProcess[];
  public selectionProcesses_status;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { hrCampaign: HrCampaign|any },
    private readonly _dialogRef: MatDialogRef<DialogHrCampaignComponent>,
    private readonly _fb: FormBuilder,
    private readonly _selectionProcessService: SelectionProcessService,
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      title: [null, [Validators.required]],
      message: [null, [Validators.required]],
      type: ['Single', [Validators.required]],
      recurrence_type: [null],
      selection_process_id: [null, [Validators.required]],
      status_id: [null],
      channels: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      start_time: [null, [Validators.required]],
      is_active: [null, [Validators.required]],
    })

    if (this._data?.hrCampaign) {
      this.isNewHrCampaign = false;
      this.title = 'Editar campanha';
      this._fillForm({
        ...this._data.hrCampaign,
        start_date: new Date(this._data.hrCampaign.start_date),
        channels : this._data.hrCampaign.channels.split(',')
      });
    }

    this.getSelectionProcess()
  }

  private _fillForm(funnel: HrCampaign): void {

    this.form.patchValue(funnel);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public async onSubmit(form: FormGroup): Promise<void> {

    await this.form.get('type')?.valueChanges.subscribe((value) => {
      const recurrenceTypeControl = this.form.get('recurrence_type');
      if (value === this.hrCampaignTypeEnum.Recurrence) {
        recurrenceTypeControl?.setValidators([Validators.required]);
        recurrenceTypeControl?.updateValueAndValidity();
      } else {
        recurrenceTypeControl?.clearValidators();
        recurrenceTypeControl?.updateValueAndValidity();
      }
    });

    if(!form.valid){
      form.markAllAsTouched();
    }else{
      this._dialogRef.close({
        ...form.getRawValue(),
        channels: form.get('channels').value.join(','),
      })
    }
  }

  public async getSelectionProcess() {
    await this._selectionProcessService.getList().pipe(finalize(() => {
      if(this.form.get('selection_process_id').value){
        this.getSelectionProcessStatus(this.form.get('selection_process_id').value)
      }
    }))
      .subscribe(res => {
        this.selectionProcesses = res.data;
      })
  }

  public getSelectionProcessStatus(selection_process_id: number) {
    this.selectionProcesses_status = this.selectionProcesses.filter(process => process.id == selection_process_id)[0].statuses
  }

  get selectionProcessStatusControl() {
    return this.form.get('status_id')!;
  }

  async onSelectionProcessChange(event: any): Promise<void> {
    const funnelId = event.value;
    if (funnelId) {
      await this.getSelectionProcessStatus(funnelId)
      this.selectionProcessStatusControl.enable();
    } else {
      this.selectionProcessStatusControl.disable();
    }
  }

}
