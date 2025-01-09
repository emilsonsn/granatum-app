import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Lead} from "@models/Lead";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {Funnel} from "@models/Funnel";
import {FunnelService} from "@services/crm/funnel.service";

@Component({
  selector: 'app-dialog-leads',
  templateUrl: './dialog-leads.component.html',
  styleUrls: ['./dialog-leads.component.scss']
})
export class DialogLeadsComponent {
  leadForm: FormGroup;
  title: string = 'Criar Lead';
  loading: any;
  isNewLead: boolean;
  protected users: User[] = [];
  protected funnels: Funnel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: Lead,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogLeadsComponent>,
    private readonly _userService: UserService,
    private readonly _funnelService: FunnelService
  ) {
    this.leadForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      phone: ['', [Validators.required, Validators.maxLength(256)]],
      origin: [''],
      observations: [''],
      responsible_id: [null, [Validators.required, Validators.min(1)]],
      funnel_id: [null, [Validators.required, Validators.min(1)]],
    });

    this.getUsers();
    this.getFunnels();

    if (this._data) {
      this.isNewLead = false;
      this.title = 'Editar Lead';
      this.leadForm.patchValue(this._data);
    }
  }

  submit() {
    if (this.leadForm.valid) {
      const lead: Lead = this.leadForm.value;
      this.dialogRef.close(lead);
    }
  }

  close() {
    this.dialogRef.close();
  }


  onConfirm() {
    if (!this.leadForm.valid) {
      this.leadForm.markAllAsTouched();
    } else {

      const formData = new FormData();
      formData.append('name', this.leadForm.get('name')?.value);
      formData.append('email', this.leadForm.get('email')?.value);
      formData.append('phone', this.leadForm.get('phone')?.value);
      formData.append('origin', this.leadForm.get('origin')?.value);
      formData.append('observations', this.leadForm.get('observations')?.value);
      formData.append('responsible_id', this.leadForm.get('responsible_id')?.value);
      formData.append('funnel_id', this.leadForm.get('funnel_id')?.value);

      this.dialogRef.close(formData)
    }
  }

  public getUsers() {
    this._userService.getUsers()
      .subscribe(res => {
        this.users = res.data;
      })
  }

  private getFunnels() {
    this._funnelService.getFunnels().subscribe(res => {
      this.funnels = res.data;
    })
  }
}
