import { FunnelStep } from '@models/Funnel';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Automations, AutomationsChannels, AutomationsRecurrenceType, AutomationsType } from '@models/automations';
import { FunnelStepService } from '@services/crm/funnel-step.service';
import { FunnelService } from '@services/crm/funnel.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-automations',
  templateUrl: './dialog-automations.component.html',
  styleUrl: './dialog-automations.component.scss'
})
export class DialogAutomationsComponent {

  public isNewAutomations: boolean = true;
  public title: string = 'Nova campanha';

  public form: FormGroup;

  public loading : boolean = false;
  public automationType = Object.entries(AutomationsType);
  public automationTypeEnum = AutomationsType;
  public recurrenceType = Object.entries(AutomationsRecurrenceType);
  public automationsChannels = Object.entries(AutomationsChannels);
  public funnels;
  public funnel_steps;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { automations: Automations },
    private readonly _dialogRef: MatDialogRef<DialogAutomationsComponent>,
    private readonly _fb: FormBuilder,
    private readonly _funnelService: FunnelService,
    private readonly _funnelStepService: FunnelStepService,
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      title: [null, [Validators.required]],
      message: [null, [Validators.required]],
      type: [null, [Validators.required]],
      recurrence_type: [null],
      funnel_id: [null, [Validators.required]],
      funnel_step_id: [null],
      channels: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
    })

    if (this._data?.automations) {
      this.isNewAutomations = false;
      this.title = 'Editar campanha';
      this._fillForm(this._data.automations);
    }

    this.getFunnels()
  }

  private _fillForm(funnel: Automations): void {

    this.form.patchValue(funnel);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public async onSubmit(form: FormGroup): Promise<void> {

    await this.form.get('type')?.valueChanges.subscribe((value) => {
      const recurrenceTypeControl = this.form.get('recurrence_type');
      if (value === this.automationTypeEnum.Recurring) {
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
      this._dialogRef.close(form.getRawValue())
    }
  }

  public getFunnels() {
    this._funnelService.getFunnels().pipe(finalize(() => {
      if(this.form.get('funnel_id').value){
        this.getFunnelSteps(this.form.get('funnel_id').value)
      }
    }))
      .subscribe(res => {
        this.funnels = res.data;
      })
  }

  public getFunnelSteps(funnel_id: number) {
    let filter = {
      funnel_id: funnel_id
    }
    this._funnelStepService.getFunnelsSteps(null, filter)
      .subscribe(res => {
        this.funnel_steps = res.data;
      })
  }

  get funnelStepControl() {
    return this.form.get('funnel_step_id')!;
  }

  async onFunnelChange(event: any): Promise<void> {
    const funnelId = event.value;
    if (funnelId) {
      await this.getFunnelSteps(funnelId)
      this.funnelStepControl.enable();
    } else {
      this.funnelStepControl.disable();
    }
  }

}
