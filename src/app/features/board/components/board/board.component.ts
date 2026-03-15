import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  OnInit,
  input,
  effect,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BoardCardComponent } from '../board-card/board-card.component';
import { CreateColumnFormComponent } from '../create-column-form/create-column-form.component';
import { ITask, IColumn } from '../../../../core/models';
import { BoardService } from '../../../../core/services';
import * as BoardActions from '../../../../core/store/board/actions/board.actions';

@Component({
  selector: 'app-board',
  imports: [BoardCardComponent, DragDropModule, CreateColumnFormComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private boardService = inject(BoardService);
  private router = inject(Router);
  private store = inject(Store);

  public readonly boardId = input<number>(1);
  public readonly filterStatus = input<string | null>(null);
  public readonly sortBy = input<string | null>(null);

  public columns: IColumn[] = [];
  public isCreatingColumn = signal(false);

  constructor() {
    effect(() => {
      const id = this.boardId();
      const filter = this.filterStatus();
      const sort = this.sortBy();
      this.boardService.allBoardsData();

      this.loadBoardData(id, filter, sort);
    });
  }

  public loadBoardData(boardId: number, filterStatus: string | null, sortBy: string | null): void {
    const boardData = this.boardService.getBoardDataByIndex(boardId - 1);
    if (!boardData) return;

    const columns =
      boardData.columns?.map((column: IColumn) => ({
        name: column.name,
        tasks: this.filterAndSortTasks([...column.tasks], filterStatus, sortBy),
      })) ?? [];

    this.columns = columns;
    this.changeDetectorRef.markForCheck();
  }

  public filterAndSortTasks(
    tasks: ITask[],
    filterStatus: string | null,
    sortBy: string | null,
  ): ITask[] {
    let filtered = [...tasks];

    if (filterStatus) {
      filtered = filtered.filter(
        (task) => task.status.toLowerCase() === filterStatus.toLowerCase(),
      );
    }

    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'subtasks') {
      filtered.sort((a, b) => a.subtasks.length - b.subtasks.length);
    }

    return filtered;
  }

  public drop(event: CdkDragDrop<ITask[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const movedTask = event.container.data[event.currentIndex];
      const targetColumn = this.columns.find((col) => col.tasks === event.container.data);
      if (movedTask && targetColumn) {
        movedTask.status = targetColumn.name;
        this.store.dispatch(
          BoardActions.updateTask({
            boardId: this.boardId(),
            taskId: movedTask.id,
            taskData: { status: targetColumn.name }
          })
        );
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  public onTaskClick(taskId: string): void {
    this.router.navigate(['/board', this.boardId(), 'edit', taskId]);
  }

  public onCreateColumn(): void {
    this.isCreatingColumn.set(true);
  }

  public onColumnCreated(column: IColumn): void {
    this.isCreatingColumn.set(false);
    this.store.dispatch(
      BoardActions.addColumn({
        boardId: this.boardId(),
        columnName: column.name
      })
    );
  }

  public onColumnFormCanceled(): void {
    this.isCreatingColumn.set(false);
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.loadBoards());
  }
}
