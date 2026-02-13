import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { Sidebar } from '../../../features/board/components/sidebar/sidebar';
import { Header } from '../../../features/board/components/header/header';
import { Board } from '../../../features/board/components/board/board';
import { AddTaskFormComponent, TaskFormData } from '../../../features/board/components/add-task-form/add-task-form';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BoardService } from '../../services';
import { ShowSidebarButton } from '../../../shared/components';
import { HasUnsavedChanges } from '../../guards';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Header, Board, ShowSidebarButton, AddTaskFormComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout implements HasUnsavedChanges {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boardService = inject(BoardService);
  
  public readonly sidebarHidden = signal(false);
  public readonly showAddTaskModal = signal(false);
  
  public readonly boardId = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        return id ? Number(id) : 1;
      })
    ),
    { initialValue: 1 }
  );
  
  public readonly boardTitle = computed(() => {
    const board = this.boardService.getBoardById(this.boardId());
    return board?.name ?? 'Platform Launch';
  });
  
  public readonly filterStatus = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('filter'))),
    { initialValue: null }
  );
  
  public readonly sortBy = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('sort'))),
    { initialValue: null }
  );

  public onFilterChange(status: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: status || null },
      queryParamsHandling: 'merge'
    });
  }

  public onAddTask(): void {
    this.showAddTaskModal.set(true);
  }

  public onTaskCreated(taskData: TaskFormData): void {
    console.log('Task created:', taskData);
    this.showAddTaskModal.set(false);
  }

  public closeModal(): void {
    this.showAddTaskModal.set(false);
  }

  public hasUnsavedChanges(): boolean {
    return false;
  }
}
