import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetService } from '@services/crm/budget.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-budget-generated',
  templateUrl: './budget-generated.component.html',
  styleUrl: './budget-generated.component.scss'
})
export class BudgetGeneratedComponent {

  loading: boolean = false;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _budgetService: BudgetService,
    private readonly _router: Router,
  ){}


  openBudgetDialog(){
        const dialogConfig: MatDialogConfig = {
          width: '80%',
          maxWidth: '1000px',
          maxHeight: '90%',
          hasBackdrop: true,
          closeOnNavigation: true,
        };
    
        // this._dialog.open(DialogBudgetGeneratedComponent,
        //     {
        //       ...dialogConfig
        //     })
        //   .afterClosed()
        //   .subscribe((res) => {
        //     if (!res) {
        //       this.updateSectorsUser();
        //     }
        //   })
  }
}
