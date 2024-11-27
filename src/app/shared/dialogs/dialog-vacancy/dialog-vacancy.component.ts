import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Profession } from '@models/profession';
import { ProfessionService } from '@services/profession.service';
import { VacancyService } from '@services/vacancy.service';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-dialog-vacancy',
  templateUrl: './dialog-vacancy.component.html',
  styleUrl: './dialog-vacancy.component.scss',
})
export class DialogVacancyComponent {
  public loading: boolean = false;
  public form: FormGroup;
  protected _onDestroy = new Subject<void>();

  // Selects
  protected professionSelect: Profession[] = [];
  protected professionCtrl: FormControl<any> = new FormControl<any>(null);
  protected professionFilterCtrl: FormControl<any> = new FormControl<string>(
    ''
  );
  protected filteredProfessions: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogVacancyComponent>,
    private readonly _fb: FormBuilder,
    private readonly _professionService: ProfessionService,
    private readonly _vacancyService: VacancyService,
    private readonly _toastr: ToastrService
  ) {
    this.getProfessionsFromBack();
  }

  ngOnInit() {
    this.form = this._fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      profession_id: [null, Validators.required],
    });

    if (this._data) {
      this.form.patchValue(this._data);
    }
  }

  public onConfirm() {
    if (!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    if (this._data) {
      this.patch(this._data?.id);
    } else {
      this.post();
    }
  }

  public post() {
    this._vacancyService
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
    this._vacancyService
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

  protected setDescription(html : string) {
    this.form.patchValue({ description: html });
  }

  // Utils
  private _initOrStopLoading() {
    this.loading = !this.loading;
  }

  public onCancel() {
    this._dialogRef.close();
  }

  // Selects
  protected prepareFilterProfessionCtrl() {
    this.professionFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.professionSelect.slice();
          } else {
            search = search.toLowerCase();
            return this.professionSelect.filter((profession) =>
              profession.title.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredProfessions.next(filtered);
      });
  }

  public clearProfessionId() {
    this.form.get('profession_id').patchValue('');
  }

  // Getters
  public getProfessionsFromBack() {
    this._professionService.getList().subscribe((res) => {
      this.professionSelect = res.data;

      this.filteredProfessions.next(this.professionSelect.slice());
      this.prepareFilterProfessionCtrl();
    });
  }
}
