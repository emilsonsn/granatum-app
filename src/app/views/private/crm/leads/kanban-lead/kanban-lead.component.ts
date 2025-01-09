import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DialogCandidateComponent } from '@shared/dialogs/dialog-candidate/dialog-candidate.component';
import { FunnelStepService } from '@services/crm/funnel-step.service';
import { DialogFunnelStepComponent } from '@shared/dialogs/dialog-funnel-step/dialog-funnel-step.component';
import { FunnelStep } from '@models/Funnel';
import { Lead } from '@models/Lead';

@Component({
  selector: 'app-kanban-lead',
  templateUrl: './kanban-lead.component.html',
  styleUrls: ['./kanban-lead.component.scss'],
})
export class KanbanLeadComponent {
  public funnelSteps: FunnelStep[] = [];

  constructor(
    private readonly funnelStepService: FunnelStepService,
    private readonly _toastr: ToastrService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _dialog: MatDialog
  ) {
    this.loadFunnelSteps();
  }

  /**
   * Carrega as etapas do funil e seus respectivos leads
   */
  private loadFunnelSteps(): void {
    this.funnelStepService
      .getFunnelsSteps()
      .pipe(finalize(() => {}))
      .subscribe((res) => {
        this.funnelSteps = res.data.reverse();
      });
  }

  /**
   * Abre o diálogo para criar uma nova etapa no funil
   */
  openCreateDialog(): void {
    const dialogRef = this._dialog.open(DialogFunnelStepComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadFunnelSteps(); // Atualiza os dados após criar
        this._toastr.success('Etapa criada com sucesso!');
      }
    });
  }

  /**
   * Gerencia o evento de drag-and-drop para mover leads entre colunas
   * @param $event Evento de drag-and-drop
   */
  drop($event: CdkDragDrop<FunnelStep, any>): void {
    if ($event.previousContainer === $event.container) {
      // Reordena os itens na mesma coluna
      moveItemInArray(
        $event.container.data.leads,
        $event.previousIndex,
        $event.currentIndex
      );
    } else {
      // Transfere um lead entre colunas diferentes
      const movedLead = $event.previousContainer.data.leads[$event.previousIndex];

      transferArrayItem(
        $event.previousContainer.data.leads,
        $event.container.data.leads,
        $event.previousIndex,
        $event.currentIndex
      );

      console.log(movedLead);
      console.log($event.container.data);// Coluna

      // Atualiza o backend com a nova coluna do lead
      this.funnelStepService
        .leadStep({
          step_id: $event.container.data.id,
          lead_id: movedLead.lead.id,
        })
        .subscribe(
          () => {
            // this._toastr.success('Status atualizado com sucesso!');
          },
          () => {
            this._toastr.error('Erro ao atualizar posição.');
            // Reverte a movimentação em caso de erro
            transferArrayItem(
              $event.container.data.leads,
              $event.previousContainer.data.leads,
              $event.currentIndex,
              $event.previousIndex
            );
          }
        );
    }
  }

  /**
   * Gerencia o clique em um lead
   * @param item Objeto Lead clicado
   */
  onBoxClick(item: Lead): void {
    console.log(item);
    // Redireciona ou executa outra lógica com o lead clicado
  }

  /**
   * Abre o diálogo para edição de um candidato
   * @param data Dados do candidato (opcional)
   */
  private openCandidateDialog(data?): void {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogCandidateComponent, {
      data: data ? { ...data } : null,
      ...dialogConfig,
    }).afterClosed();
  }

  /**
   * Deleta uma tarefa após confirmação
   * @param $event Evento do clique (evita propagação)
   * @param item Objeto Lead a ser deletado
   */
  deleteTask($event: MouseEvent, item: Lead): void {
    $event.stopPropagation(); // Evita propagação do clique para o card

    if (confirm('Tem certeza que deseja excluir este lead?')) {
      // Implementar lógica para deletar o lead, se necessário
      console.log('Lead deletado:', item);
    }
  }
}
