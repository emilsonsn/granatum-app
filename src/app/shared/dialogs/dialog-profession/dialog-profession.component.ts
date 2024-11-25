import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfessionService } from '@services/profession.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-profession',
  templateUrl: './dialog-profession.component.html',
  styleUrl: './dialog-profession.component.scss',
})
export class DialogProfessionComponent {
  public loading: boolean = false;
  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogProfessionComponent>,
    private readonly _fb: FormBuilder,
    private readonly _professionService: ProfessionService,
    private readonly _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    });

    if(this._data) {
      this.form.patchValue(this._data);
    }
  }

  public onConfirm() {
    if (!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    if (this._data) {
      this.patch(this._data.id);
    } else {
      this.post();
    }
  }

  public post() {
    this._professionService
      .post(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.message);
        },
      });
  }

  public patch(id: number) {
    this._professionService
      .patch(id, this.form.getRawValue())
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.message);
        },
      });
  }

  // Utils
  private _initOrStopLoading() {
    this.loading = !this.loading;
  }

  public onCancel() {
    this._dialogRef.close();
  }
}
