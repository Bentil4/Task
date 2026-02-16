import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditTaskFormComponent } from '../../components/edit-task-form/edit-task-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components';
import { ITaskFormData, ITask, IHasUnsavedChanges } from '../../../../core/models';
import { BoardService, NotificationService, DialogService } from '../../../../core/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-task-page',
  templateUrl: './edit-task-page.component.html',
  styleUrl: './edit-task-page.component.css',
  imports: [EditTaskFormComponent, ConfirmDialogComponent],
})
export class EditTaskPageComponent implements OnInit, IHasUnsavedChanges {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

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

  onTaskUpdated(taskData: ITaskFormData): void {
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

  async onCancel(): Promise<void> {
    if (this.formComponent?.isDirty) {
      const confirmed = await this.dialogService.confirm({
        title: 'Discard Changes',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        confirmText: 'Discard',
        cancelText: 'Keep Editing',
      });
      
      if (!confirmed) return;
    }
    
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
