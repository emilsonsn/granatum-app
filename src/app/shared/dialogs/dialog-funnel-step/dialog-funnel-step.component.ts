import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute, Router} from '@angular/router';
import {FunnelStepService} from "@services/crm/funnel-step.service";
import {FunnelStep} from "@models/Funnel";

@Component({
  selector: 'app-dialog-funnel-step',
  templateUrl: './dialog-funnel-step.component.html',
  styleUrls: ['./dialog-funnel-step.component.scss']
})
export class DialogFunnelStepComponent implements OnInit {
  form: FormGroup;
  loading = false;
  funnelId: number;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogFunnelStepComponent>,
    private funnelStepService: FunnelStepService,
    private activatedRoute: ActivatedRoute, // Importa o ActivatedRoute
    private router: Router, // Importa o Router
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      funnel_id: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Obtém o funnel_id da URL
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.funnelId = Number(params.get('id'));
    });

    this.form.patchValue({
      funnel_id: this.funnelId
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const funnelStep: FunnelStep = this.form.value;

    this.funnelStepService.create(funnelStep).subscribe({
      next: (response) => {
        console.log('Funnel step created successfully:', response);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error creating funnel step:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
