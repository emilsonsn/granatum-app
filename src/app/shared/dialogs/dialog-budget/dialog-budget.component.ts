import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Budget } from '@models/budget';

@Component({
  selector: 'app-dialog-budget',
  templateUrl: './dialog-budget.component.html',
  styleUrl: './dialog-budget.component.scss'
})
export class DialogBudgetComponent {

  public isNewBudget: boolean = true;
  public title: string = 'Novo orçamento';

  public form: FormGroup;

  public loading : boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { budget: Budget },
    private readonly _dialogRef: MatDialogRef<DialogBudgetComponent>,
    private readonly _fb: FormBuilder,
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
    })

    if (this._data?.budget) {
      this.isNewBudget = false;
      this.title = 'Editar orçamento';
      this._fillForm(this._data.budget);
    }
  }

  private _fillForm(budget: Budget): void {

    this.form.patchValue(budget);
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
