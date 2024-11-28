import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Bank } from '@models/bank';
import { Utils } from '@shared/utils';

@Component({
  selector: 'app-dialog-bank',
  templateUrl: './dialog-bank.component.html',
  styleUrl: './dialog-bank.component.scss'
})
export class DialogBankComponent {

  public isNewBank: boolean = true;
  public title: string = 'Novo banco';
  public form: FormGroup;
  public loading: boolean = false;
  public profileImageFile: File | null = null;
  profileImage: string | ArrayBuffer = null;
  isDragOver: boolean = false;

  public utils = Utils;

  protected statuses = [
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { bank: Bank },
    private readonly _dialogRef: MatDialogRef<DialogBankComponent>,
    private readonly _fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      is_active: [null, [Validators.required]],
    })

    if (this._data?.bank) {
      this.isNewBank = false;
      this.title = 'Editar Banco';
      this._fillForm(this._data.bank);
      if (this._data.bank.image) {
        this.profileImage = this._data.bank.image
      }
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(event: Event): void {
    event.stopPropagation();
    this.profileImage = null;
  }


  private _fillForm(bank: Bank): void {

    this.form.patchValue(bank);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {

      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('name', form.get('name')?.value);
      formData.append('is_active', this.form.get('is_active').value);

      formData.append('image', this.profileImageFile);

      this._dialogRef.close(formData)
    }
  }
}
