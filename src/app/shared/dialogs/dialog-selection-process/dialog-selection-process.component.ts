import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Profession } from '@models/profession';
import { Vacancy } from '@models/vacancy';
import { ProfessionService } from '@services/profession.service';
import { SelectionProcessService } from '@services/selection-process.service';
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
  selector: 'app-dialog-selection-process',
  templateUrl: './dialog-selection-process.component.html',
  styleUrl: './dialog-selection-process.component.scss',
})
export class DialogSelectionProcessComponent {
  public loading: boolean = false;
  public form: FormGroup;
  protected _onDestroy = new Subject<void>();

  // Filters
  protected vacancySelect: Vacancy[] = [];
  protected vacancyCtrl: FormControl<any> = new FormControl<any>(null);
  protected vacancyFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredVacancies: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogSelectionProcessComponent>,
    private readonly _fb: FormBuilder,
    private readonly _vacancyService: VacancyService,
    private readonly _toastr: ToastrService,
    private readonly _selectionProcessService: SelectionProcessService,
  ) {
    this.getVacanciesFromBack();
  }

  ngOnInit() {
    this.form = this._fb.group({
      title: [null, Validators.required],
      available_vacancies: [null, Validators.required],
      vacancy_id: [null, Validators.required],
      total_candidates: [null, Validators.required],
      is_active: [true],
    });

    if (this._data) {
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
    this._selectionProcessService
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
    this._selectionProcessService
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

  // Filters
  protected prepareFilterVacancyCtrl() {
    this.vacancyFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.vacancySelect.slice();
          } else {
            search = search.toLowerCase();
            return this.vacancySelect.filter((vacancy) =>
              vacancy.title.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredVacancies.next(filtered);
      });
  }

  public clearProfessionId() {
    this.form.get('profession_id').patchValue('');
  }

  // Getters
  public getVacanciesFromBack() {
    this._vacancyService.getList().subscribe((res) => {
      this.vacancySelect = res.data;

      this.filteredVacancies.next(this.vacancySelect.slice());
      this.prepareFilterVacancyCtrl();
    });
  }
}
