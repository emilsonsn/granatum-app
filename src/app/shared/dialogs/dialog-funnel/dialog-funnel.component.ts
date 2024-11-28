import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Funnel } from '@models/Funnel';

@Component({
  selector: 'app-dialog-funnel',
  templateUrl: './dialog-funnel.component.html',
  styleUrl: './dialog-funnel.component.scss'
})
export class DialogFunnelComponent {

  public isNewFunnel: boolean = true;
  public title: string = 'Novo funil';

  public form: FormGroup;

  public loading : boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { funnel: Funnel },
    private readonly _dialogRef: MatDialogRef<DialogFunnelComponent>,
    private readonly _fb: FormBuilder,
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
    })

    if (this._data?.funnel) {
      this.isNewFunnel = false;
      this.title = 'Editar serviço';
      this._fillForm(this._data.funnel);
    }
  }

  private _fillForm(funnel: Funnel): void {

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

}
