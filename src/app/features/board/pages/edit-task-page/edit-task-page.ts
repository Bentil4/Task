import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditTaskFormComponent } from '../../components/edit-task-form/edit-task-form';
import { ConfirmDialogComponent } from '../../../../shared/components';
import type { TaskFormData } from '../../components/add-task-form/add-task-form';
import { BoardService, NotificationService } from '../../../../core/services';
import { HasUnsavedChanges } from '../../../../core/guards';
import type { ITask } from '../../../../core/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-task-page',
  templateUrl: './edit-task-page.html',
  styleUrl: './edit-task-page.css',
  imports: [EditTaskFormComponent, ConfirmDialogComponent],
})
export class EditTaskPage implements OnInit, HasUnsavedChanges {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private notificationService = inject(NotificationService);

  @ViewChild(EditTaskFormComponent) formComponent?: EditTaskFormComponent;

  task = signal<ITask | null>(null);
  isSubmitting = signal(false);
  showDeleteConfirm = signal(false);

  boardId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')) || 1)),
    { initialValue: 1 },
  );

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (boardId && taskId) {
      const task = this.boardService.getTaskById(Number(boardId), taskId);
      if (task) {
        this.task.set(task);
      } else {
        this.notificationService.error('Task not found');
        this.navigateToBoard(true);
      }
    }
  }

  onTaskUpdated(taskData: TaskFormData): void {
    if (this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    const boardId = this.boardId();
    const taskId = this.route.snapshot.paramMap.get('taskId');
    
    if (!taskId) {
      this.notificationService.error('Invalid task ID');
      this.isSubmitting.set(false);
      return;
    }
    
    const task = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      dueDate: taskData.dueDate,
      subtasks: taskData.subtasks.map(st => ({
        title: st.title,
        isCompleted: st.isCompleted || false
      }))
    };
    
    const success = this.boardService.updateTask(boardId, taskId, task);
    
    if (success) {
      this.notificationService.success('Task updated successfully');
      this.navigateToBoard();
    } else {
      this.notificationService.error('Failed to update task');
      this.isSubmitting.set(false);
    }
  }

  onCancel(): void {
    this.navigateToBoard();
  }

  onDeleteRequest(): void {
    this.showDeleteConfirm.set(true);
  }

  onDeleteConfirm(): void {
    if (this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    const boardId = this.boardId();
    const taskId = this.route.snapshot.paramMap.get('taskId');
    
    if (!taskId) {
      this.notificationService.error('Invalid task ID');
      this.isSubmitting.set(false);
      return;
    }
    
    const success = this.boardService.deleteTask(boardId, taskId);
    
    if (success) {
      this.notificationService.success('Task deleted successfully');
      this.navigateToBoard();
    } else {
      this.notificationService.error('Failed to delete task');
      this.isSubmitting.set(false);
      this.showDeleteConfirm.set(false);
    }
  }

  onDeleteCancel(): void {
    this.showDeleteConfirm.set(false);
  }

  hasUnsavedChanges(): boolean {
    return (this.formComponent?.isDirty ?? false) && !this.isSubmitting();
  }

  navigateToBoard(replaceUrl = false): void {
    const boardId = this.route.snapshot.paramMap.get('id') || '1';
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['/board', boardId], { queryParams, replaceUrl });
  }
}
