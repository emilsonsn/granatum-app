import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import { DialogTypeUserSectorComponent } from '../dialog-type-user-sector/dialog-type-user-sector.component';
import dayjs from 'dayjs';
import { Utils } from '@shared/utils';

@Component({
  selector: 'app-dialog-collaborator',
  templateUrl: './dialog-collaborator.component.html',
  styleUrl: './dialog-collaborator.component.scss'
})
export class DialogCollaboratorComponent {

  public isNewCollaborator: boolean = true;
  public title: string = 'Novo colaborador';

  public form: FormGroup;

  public loading : boolean = false;

  public userPositionEnum;
  public userSectorsEnum;

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: {user: User},
    private readonly _dialogRef: MatDialogRef<DialogCollaboratorComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog : MatDialog,
    private readonly _userService : UserService
  ) { }

  ngOnInit(): void {

  this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      cpf_cnpj: [null, [Validators.required]],
      birth_date: [null, [Validators.required]],
      company_position_id: [null, [Validators.required]],
      sector_id: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      whatsapp: [null, [Validators.required]],
      email: [null, [Validators.required]],
    })

    if (this._data?.user) {
      this.isNewCollaborator = false;
      this.title = 'Editar colaborador';
      this._fillForm(this._data.user);
    }

    this.updateSectorsUser();
    this.getPositionsUser();
  }

  private _fillForm(user: User): void {

    this.form.patchValue(user);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if(!form.valid){
      form.markAllAsTouched();
    }else{
      this._dialogRef.close({
        ...form.getRawValue(),
        birth_date : dayjs(form.get('birth_date').value).format('YYYY-MM-DD'),
      })
    }
  }

  public openDialogUserSector() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogTypeUserSectorComponent,
      {
        ...dialogConfig
      })
      .afterClosed()
      .subscribe( (res) => {
        if(!res) {
          this.updateSectorsUser();
        }
      })
  }

  // Utils
  public getPositionsUser() {
    this._userService.getPositionsUser()
      .subscribe(res => {
        this.userPositionEnum = res.data;
      })
  }

  public updateSectorsUser() {
    this._userService.getSectorsUser()
      .subscribe(res => {
        this.userSectorsEnum = res.data;
      })
  }

  validateCellphoneNumber(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.replace(/\D/g, '').length !== 11) {
      return false;
    }
    return true;
  }

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.replace(/\D/g, '').length !== 10) {
      return false;
    }
    return true;
  }
}
