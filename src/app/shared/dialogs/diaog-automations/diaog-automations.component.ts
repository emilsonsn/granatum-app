import { FunnelStep } from '@models/Funnel';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Automations, AutomationsRecurrenceType, AutomationsType } from '@models/automations';
import { FunnelStepService } from '@services/crm/funnel-step.service';
import { FunnelService } from '@services/crm/funnel.service';

@Component({
  selector: 'app-diaog-automations',
  templateUrl: './diaog-automations.component.html',
  styleUrl: './diaog-automations.component.scss'
})
export class DiaogAutomationsComponent {

  public isNewAutomations: boolean = true;
  public title: string = 'Nova automação';

  public form: FormGroup;

  public loading : boolean = false;
  public automationType = Object.values(AutomationsType);
  public automationTypeEnum = AutomationsType;
  public recurrenceType = Object.values(AutomationsRecurrenceType);
  public type: string = '';
  public funnels;
  public funnel_steps;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { automations: Automations },
    private readonly _dialogRef: MatDialogRef<DiaogAutomationsComponent>,
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
      recurrence_type: [null, [Validators.required]],
      funnel_id: [null, [Validators.required]],
      funnel_step_id: [null, [Validators.required]],
      channels: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
    })

    if (this._data?.automations) {
      this.isNewAutomations = false;
      this.title = 'Editar automação';
      this._fillForm(this._data.automations);
    }
  }

  private _fillForm(funnel: Automations): void {

    this.form.patchValue(funnel);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if(!form.valid){
      form.markAllAsTouched();
    }else{
      this._dialogRef.close(form.getRawValue())
    }
  }

  public getFunnels() {
    this._funnelService.getFunnels()
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
