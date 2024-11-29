import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Partner } from '@models/partner';
import { Utils } from '@shared/utils';

@Component({
  selector: 'app-dialog-partner',
  templateUrl: './dialog-partner.component.html',
  styleUrl: './dialog-partner.component.scss'
})
export class DialogPartnerComponent {

  public isNewPartner: boolean = true;
  public title: string = 'Novo parceiro';
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
    private readonly _data: { partner: Partner },
    private readonly _dialogRef: MatDialogRef<DialogPartnerComponent>,
    private readonly _fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      activity: [null, [Validators.required]],
      cnpj_cpf: [null, [Validators.required]],
      is_active: [null, [Validators.required]],
    })

    if (this._data?.partner) {
      this.isNewPartner = false;
      this.title = 'Editar parceiro';
      this._fillForm(this._data.partner);
      if (this._data.partner.image) {
        this.profileImage = this._data.partner.image
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


  private _fillForm(partner: Partner): void {

    this.form.patchValue(partner);
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
      formData.append('phone', form.get('phone')?.value);
      formData.append('activity', form.get('activity')?.value);
      formData.append('email', form.get('email')?.value);
      formData.append('cnpj_cpf', form.get('cnpj_cpf')?.value);
      formData.append('is_active', this.form.get('is_active').value);

      formData.append('image', this.profileImageFile);

      this._dialogRef.close(formData)
    }
  }

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    return !(phoneNumber && phoneNumber.replace(/\D/g, '').length !== 10);
  }
}
