import { Component, signal, output, input, effect } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { SelectComponent } from '../../../../shared/components/select/select';
import type { SelectOption } from '../../../../shared/components/select/select';
import type { ITask } from '../../../../core/models';
import type { TaskFormData } from '../add-task-form/add-task-form';

interface Subtask {
  id: number;
  title: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-edit-task-form',
  templateUrl: './edit-task-form.html',
  styleUrl: './edit-task-form.css',
  imports: [InputComponent, TextareaComponent, SelectComponent],
})
export class EditTaskFormComponent {
  task = input<ITask | null>(null);
  
  title = signal('');
  description = signal('');
  subtasks = signal<Subtask[]>([]);
  status = signal('todo');
  
  statusOptions = signal<SelectOption[]>([
    { label: 'Todo', value: 'todo' },
    { label: 'Doing', value: 'doing' },
    { label: 'Done', value: 'done' },
  ]);

  taskUpdated = output<TaskFormData>();
  canceled = output<void>();
  
  private nextSubtaskId = 1;

  constructor() {
    effect(() => {
      const taskData = this.task();
      if (taskData) {
        this.title.set(taskData.title);
        this.description.set(taskData.description);
        this.status.set(taskData.status.toLowerCase());
        this.subtasks.set(
          taskData.subtasks.map((subtask, idx) => ({
            id: ++this.nextSubtaskId,
            title: subtask.title,
            isCompleted: subtask.isCompleted ?? false
          }))
        );
      }
    });
  }

  addSubtask() {
    this.subtasks.update(subtasks => [
      ...subtasks,
      { id: ++this.nextSubtaskId, title: '', isCompleted: false }
    ]);
  }

  removeSubtask(id: number) {
    this.subtasks.update(subtasks => 
      subtasks.filter(subtask => subtask.id !== id)
    );
  }

  updateSubtask(id: number, title: string) {
    this.subtasks.update(subtasks =>
      subtasks.map(subtask =>
        subtask.id === id ? { ...subtask, title } : subtask
      )
    );
  }

  onSubmit() {
    const formData: TaskFormData = {
      title: this.title(),
      description: this.description(),
      subtasks: this.subtasks()
        .filter(subtask => subtask.title.trim())
        .map(subtask => ({ title: subtask.title, isCompleted: subtask.isCompleted })),
      status: this.status(),
    };
    
    this.taskUpdated.emit(formData);
  }

  onCancel() {
    this.canceled.emit();
  }
}
