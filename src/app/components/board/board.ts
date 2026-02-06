import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  output,
  OnInit,
  input,
  effect,
} from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Button } from '../shared/button/button';
import { BoardCard } from '../board-card/board-card';

interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: { title: string; isCompleted: boolean }[];
}

interface Column {
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-board',
  imports: [Button, BoardCard, DragDropModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);

  readonly boardId = input<number>(1);
  readonly filterStatus = input<string | null>(null);
  readonly sortBy = input<string | null>(null);
  readonly addColumn = output<Event>();

  public columns: Column[] = [];
  public isLoading = true;
  private allBoards: any[] = [];

  constructor() {
    effect(() => {
      const id = this.boardId();
      const filter = this.filterStatus();
      const sort = this.sortBy();

      this.loadBoardData(id, filter, sort);
    });
  }

  ngOnInit() {
    void this.fetchAllBoards();
  }

  async fetchAllBoards() {
    try {
      const response = await fetch('/data.json');
      if (response.ok) {
        const data = await response.json();
        this.allBoards = data.boards ?? [];
        this.loadBoardData(this.boardId(), this.filterStatus(), this.sortBy());
      }
    } catch (error) {
      console.error('Failed to load boards:', error);
    }
  }

  loadBoardData(boardId: number, filterStatus: string | null, sortBy: string | null) {
    if (!this.allBoards.length) return;

    this.isLoading = true;
    const boardIndex = boardId - 1;
    let columns = this.allBoards[boardIndex]?.columns ?? [];

    columns = columns.map((col: Column) => ({
      ...col,
      tasks: this.filterAndSortTasks(col.tasks, filterStatus, sortBy),
    }));

    this.columns = columns;
    this.isLoading = false;
    this.changeDetectorRef.markForCheck();
  }

  filterAndSortTasks(tasks: Task[], filterStatus: string | null, sortBy: string | null): Task[] {
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

  onAddColumn(event: Event) {
    this.addColumn.emit(event);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.changeDetectorRef.markForCheck();
  }
}
