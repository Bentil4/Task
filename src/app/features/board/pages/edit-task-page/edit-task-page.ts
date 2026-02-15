import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditTaskFormComponent } from '../../components/edit-task-form/edit-task-form';
import type { TaskFormData } from '../../components/add-task-form/add-task-form';
import { BoardService } from '../../../../core/services';
import type { ITask } from '../../../../core/models';

@Component({
  selector: 'app-edit-task-page',
  templateUrl: './edit-task-page.html',
  styleUrl: './edit-task-page.css',
  imports: [EditTaskFormComponent],
})
export class EditTaskPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);

  public task = signal<ITask | null>(null);

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    const taskId = this.route.snapshot.paramMap.get('taskId');
    
    if (boardId && taskId) {
      const task = this.boardService.getTaskById(Number(boardId), taskId);
      if (task) {
        this.task.set(task);
      } else {
        this.navigateToBoard();
      }
    }
  }

  public onTaskUpdated(taskData: TaskFormData): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    const taskId = this.route.snapshot.paramMap.get('taskId');
    console.log('Task updated:', taskData, 'for board:', boardId, 'task:', taskId);
    this.navigateToBoard();
  }

  public onCancel(): void {
    this.navigateToBoard();
  }

  private navigateToBoard(): void {
    const boardId = this.route.snapshot.paramMap.get('id') || '1';
    this.router.navigate(['/board', boardId]);
  }
}
