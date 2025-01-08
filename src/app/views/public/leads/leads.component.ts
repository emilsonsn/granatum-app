import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

      constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute
      ) {
        this.form = this.fb.group({
          id: [null],
          name: ['', [Validators.required, Validators.maxLength(256)]],
          email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
          phone: ['', [Validators.required, Validators.maxLength(256)]],
          origin: [''],
          observations: [''],
          responsible_id: [null],
        });
      }

      ngOnInit() {
        this.id = +this.route.snapshot.queryParamMap.get('id');
        this.responsible_id = +this.route.snapshot.queryParamMap.get('responsible');
      }

      onSubmit(form: FormGroup) {
        if (!form.valid) {
          form.markAllAsTouched();
        } else {
          form.patchValue({
            responsible_id: this.responsible_id,
          });
          console.log(this.form.getRawValue())
        }
      }
}
