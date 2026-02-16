import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddTaskFormComponent } from '../../components/add-task-form/add-task-form.component';
import { ITaskFormData, IHasUnsavedChanges } from '../../../../core/models';
import { BoardService, NotificationService, DialogService } from '../../../../core/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-task-page',
  templateUrl: './new-task-page.component.html',
  styleUrl: './new-task-page.component.css',
  imports: [AddTaskFormComponent],
})
export class NewTaskPageComponent implements IHasUnsavedChanges {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

  @ViewChild(AddTaskFormComponent) formComponent?: AddTaskFormComponent;

  isSubmitting = signal(false);

  boardId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id')) || 1)),
    { initialValue: 1 }
  );

  onTaskCreated(taskData: ITaskFormData): void {
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

  async onCancel(): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: 'Cancel Task Creation',
      message: 'Are you sure you want to cancel? Any entered data will be lost.',
      confirmText: 'Yes, Cancel',
      cancelText: 'No, Continue',
    });
    
    if (confirmed) {
      this.navigateToBoard();
    }
  }

  hasUnsavedChanges(): boolean {
    return (this.formComponent?.form.dirty ?? false) && !this.isSubmitting();
  }

  navigateToBoard(): void {
    const boardId = this.route.snapshot.paramMap.get('id') || '1';
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['/board', boardId], { queryParams });
  }
}
