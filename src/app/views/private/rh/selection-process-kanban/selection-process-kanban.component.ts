import {Component} from '@angular/core';
import {SelectionProcessService} from "@services/selection-process.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {CandidateStatus, Statuses} from "@models/selectionProccess";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogCandidateComponent} from "@shared/dialogs/dialog-candidate/dialog-candidate.component";

@Component({
  selector: 'app-selection-process-kanban',
  templateUrl: './selection-process-kanban.component.html',
  styleUrls: ['./selection-process-kanban.component.scss']
})
export class SelectionProcessKanbanComponent {

  public statuses: Statuses[] = [];

  constructor(
    private readonly _selectionProcessService: SelectionProcessService,
    private readonly _toastr: ToastrService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
  ) {
    _selectionProcessService.getById(this._activatedRoute?.snapshot.params['id'])
      .pipe(finalize(() => {
      }))
      .subscribe((res) => {
        this.statuses = res.statuses;

        this._router.navigate([], {
          relativeTo: this._activatedRoute, // Use _activatedRoute aqui
          queryParams: {title_process: res.title},
          queryParamsHandling: 'merge',
          replaceUrl: true,
        }).then();
      });
  }


  /**
   * Gerencia o evento de drag-and-drop
   * @param $event CdkDragDrop contendo as informações de origem e destino
   */
  drop($event: CdkDragDrop<Statuses, any>): void {
    if ($event.previousContainer === $event.container) {
      // Reordena os itens na mesma lista
      moveItemInArray(
        $event.container.data.candidate_statuses,
        $event.previousIndex,
        $event.currentIndex
      );
    } else {
      // Transfere itens entre listas diferentes
      const movedItem = $event.previousContainer.data.candidate_statuses[$event.previousIndex];

      console.log(movedItem);
      console.log($event.container.data);

      transferArrayItem(
        $event.previousContainer.data.candidate_statuses,
        $event.container.data.candidate_statuses,
        $event.previousIndex,
        $event.currentIndex
      );

      // Atualiza o backend após mover o item
      this._selectionProcessService.updateCandidateStatus(movedItem.candidate_id, $event.container.data.id)
        .subscribe(() => {
          this._toastr.success('Status atualizado com sucesso!');
        }, () => {
          this._toastr.error('Erro ao atualizar o status.');
        });
    }
  }

  /**
   * Gerencia o clique em um card
   * @param item Objeto CandidateStatus referente ao card clicado
   */
  onBoxClick(item: CandidateStatus): void {
    console.log(item);
    this.openCandidateDialog(item.candidate);
    // this._router.navigate([`/candidates/${item.candidate_id}`]);
  }

  private openCandidateDialog(data?) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '1000px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogCandidateComponent, {
        data: data ? {...data} : null,
        ...dialogConfig,
      })
      .afterClosed();
  }

  /**
   * Deleta uma tarefa após confirmação
   * @param $event Evento do clique (evita propagação)
   * @param item Objeto CandidateStatus a ser deletado
   */
  deleteTask($event: MouseEvent, item: CandidateStatus): void {
    $event.stopPropagation(); // Evita que o clique no ícone de delete acione o clique do card

    /*if (confirm('Tem certeza que deseja excluir este candidato?')) {
      this._selectionProcessService.deleteCandidateStatus(item.id)
        .subscribe(() => {
          this.statuses.forEach(status => {
            const index = status.candidate_statuses.findIndex(cs => cs.id === item.id);
            if (index !== -1) {
              status.candidate_statuses.splice(index, 1);
            }
          });
          this._toastr.success('Candidato removido com sucesso!');
        }, () => {
          this._toastr.error('Erro ao remover o candidato.');
        });
    }*/
  }
}
