import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddTaskFormComponent } from '../../components/add-task-form/add-task-form';
import type { TaskFormData } from '../../components/add-task-form/add-task-form';
import { BoardService } from '../../../../core/services';

@Component({
  selector: 'app-new-task-page',
  templateUrl: './new-task-page.html',
  styleUrl: './new-task-page.css',
  imports: [AddTaskFormComponent],
})
export class NewTaskPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);

  onTaskCreated(taskData: TaskFormData): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    console.log('Task created:', taskData, 'for board:', boardId);
    
    this.navigateToBoard();
  }

  onCancel(): void {
    this.navigateToBoard();
  }

  private navigateToBoard(): void {
    const boardId = this.route.snapshot.paramMap.get('id') || '1';
    this.router.navigate(['/board', boardId]);
  }
}
