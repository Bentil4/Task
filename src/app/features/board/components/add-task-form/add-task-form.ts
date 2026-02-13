import { Component, signal, output } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { SelectComponent } from '../../../../shared/components/select/select';

import type { SelectOption } from '../../../../shared/components/select/select';

interface Subtask {
  id: number;
  title: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  subtasks: string[];
  status: string;
}

@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.html',
  styleUrl: './add-task-form.css',
  imports: [InputComponent, TextareaComponent, SelectComponent],
})
export class AddTaskFormComponent {
  title = signal('');
  description = signal('');
  subtasks = signal<Subtask[]>([]);
  status = signal('todo');
  
  statusOptions = signal<SelectOption[]>([
    { label: 'Todo', value: 'todo' },
    { label: 'Doing', value: 'doing' },
    { label: 'Done', value: 'done' },
  ]);

  taskCreated = output<TaskFormData>();
  canceled = output<void>();
  
  private nextSubtaskId = 1;

  addSubtask() {
    this.subtasks.update(subtasks => [
      ...subtasks,
      { id: this.nextSubtaskId++, title: '' }
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
        .map(subtask => subtask.title),
      status: this.status(),
    };
    
    this.taskCreated.emit(formData);
  }

  onCancel() {
    this.canceled.emit();
  }
}
