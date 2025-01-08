import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeadService } from '@services/crm/lead.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss'
})
export class LeadsComponent {
    protected form: FormGroup;
    protected loading: boolean = false;
    protected id:number = 0;
    protected responsible_id:number = 0;
    public isRegistered = false;

    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private readonly _leadService: LeadService,
      private readonly _toastr: ToastrService,
    ) {}

    ngOnInit() {

      this.id = +this.route.snapshot.queryParamMap.get('id');
      this.responsible_id = +this.route.snapshot.queryParamMap.get('responsible');

      this.form = this.fb.group({
        id: [null],
        name: ['', [Validators.required, Validators.maxLength(256)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
        phone: ['', [Validators.required, Validators.maxLength(256)]],
        origin: ['Formulário de cadastro'],
        observations: ['Lead cadastrado por link de cadastro'],
        responsible_id: [null],
        funnel_id: [this.id]
      });
    }
    onSubmit(form: FormGroup) {
      if (!form.valid) {
        form.markAllAsTouched();
      } else {          
        this._leadService.create({
          ...form.getRawValue(),
          responsible_id: this.responsible_id,
        })
        .subscribe({
          next: (value) => {
            this._toastr.success('Ação realizada com sucesso.');
            this.isRegistered = true;
          },
          error: (error) => {
            console.error('Error:', error);
          }
        })
      }
    }
}
