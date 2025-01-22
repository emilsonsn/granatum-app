import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetService } from '@services/crm/budget.service';
import { LeadService } from '@services/crm/lead.service';
import { BudgetGeneratedService } from '@services/crm/budget_generated.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-budget-generated',
  templateUrl: './dialog-budget-generated.component.html',
  styleUrls: ['./dialog-budget-generated.component.scss']
})
export class DialogBudgetGeneratedComponent {
  form: FormGroup;
  isNewBudget: boolean;
  budgets: any[] = [];
  leads: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogBudgetGeneratedComponent>,
    private _budgetGeneratedService: BudgetGeneratedService,
    private _budgetService: BudgetService,
    private _leadService: LeadService,
    private _toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      status: [this.data?.budgetGenerated?.status || 'Generated', Validators.required],
      description: [this.data?.budgetGenerated?.description || '', Validators.required],
      budget_id: [this.data?.budgetGenerated?.budget?.id || null, Validators.required],
      lead_id: [this.data?.budgetGenerated?.lead?.id || null, Validators.required]
    });

    this.isNewBudget = !this.data?.budgetGenerated;

    if (this.data?.budgetGenerated) {
      this.form.patchValue(this.data.budgetGenerated);
    }

    this.getBudgets();
    this.getLeads();
  }


  private getBudgets() {
    this._budgetService.search().subscribe({
      next: (res) => this.budgets = res.data,
      error: (err) => {
        console.error('Erro ao carregar modelos:', err);
        this._toastr.error('Erro ao carregar modelos.');
      }
    });
  }

  private getLeads() {
    this._leadService.search().subscribe({
      next: (res) => this.leads = res.data,
      error: (err) => {
        console.error('Erro ao carregar leads:', err);
        this._toastr.error('Erro ao carregar leads.');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toastr.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const statusMap = {
      pending: 'Generated',
      approved: 'Approved',
      rejected: 'Desapproved'
    };
    const payload = {
      ...this.form.value
    };
    this.dialogRef.close(payload);

  }

  onCancel() {
    this.dialogRef.close();
  }
}
