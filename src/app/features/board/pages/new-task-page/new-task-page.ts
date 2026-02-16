import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddTaskFormComponent } from '../../components/add-task-form/add-task-form';
import type { TaskFormData } from '../../components/add-task-form/add-task-form';
import { BoardService, NotificationService } from '../../../../core/services';
import { HasUnsavedChanges } from '../../../../core/guards';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-task-page',
  templateUrl: './new-task-page.html',
  styleUrl: './new-task-page.css',
  imports: [AddTaskFormComponent],
})
export class NewTaskPage implements HasUnsavedChanges {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private notificationService = inject(NotificationService);

  isSubmitting = signal(false);

  boardId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id')) || 1)),
    { initialValue: 1 }
  );

  onTaskCreated(taskData: TaskFormData): void {
    if (this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    const boardId = this.boardId();
    
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
    
    const success = this.boardService.addTask(boardId, task);
    
    if (success) {
      this.notificationService.success('Task created successfully');
      this.navigateToBoard();
    } else {
      this.notificationService.error('Failed to create task');
      this.isSubmitting.set(false);
    }
  }

  onCancel(): void {
    this.navigateToBoard();
  }

  hasUnsavedChanges(): boolean {
    return false;
  }

  navigateToBoard(): void {
    const boardId = this.route.snapshot.paramMap.get('id') || '1';
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['/board', boardId], { queryParams });
  }
}
