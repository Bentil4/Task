import { Component, output, input, effect, inject, computed } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { SelectComponent } from '../../../../shared/components/select/select';
import { DateInputComponent } from '../../../../shared/components/date-input/date-input';
import { BoardService } from '../../../../core/services';
import type { SelectOption } from '../../../../shared/components/select/select';
import type { ITask } from '../../../../core/models';
import type { TaskFormData } from '../add-task-form/add-task-form';

@Component({
  selector: 'app-edit-task-form',
  templateUrl: './edit-task-form.html',
  styleUrl: './edit-task-form.css',
  imports: [ReactiveFormsModule, InputComponent, TextareaComponent, SelectComponent, DateInputComponent],
})
export class EditTaskFormComponent {
  private fb = inject(FormBuilder);
  private boardService = inject(BoardService);
  
  public task = input<ITask | null>(null);
  public boardId = input<number>(1);
  
  public form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    dueDate: [''],
    status: ['', Validators.required],
    subtasks: this.fb.array<any>([])
  });
  
  public statusOptions = computed<SelectOption[]>(() => {
    const board = this.boardService.getBoardDataByIndex(this.boardId() - 1);
    return board?.columns?.map(column => ({
      label: column.name,
      value: column.name.toLowerCase()
    })) ?? [
      { label: 'Todo', value: 'todo' },
      { label: 'Doing', value: 'doing' },
      { label: 'Done', value: 'done' }
    ];
  });

  public taskUpdated = output<TaskFormData>();
  public canceled = output<void>();
  
  get subtasks() {
    return this.form.get('subtasks') as FormArray;
  }

  constructor() {
    effect(() => {
      const taskData = this.task();
      if (taskData) {
        this.form.patchValue({
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate || '',
          status: taskData.status.toLowerCase()
        });
        
        this.subtasks.clear();
        taskData.subtasks.forEach(subtask => {
          this.subtasks.push(this.fb.group({
            title: [subtask.title],
            isCompleted: [subtask.isCompleted]
          }));
        });
      }
    });
  }

  public addSubtask() {
    this.subtasks.push(this.fb.group({
      title: [''],
      isCompleted: [false]
    }));
  }

  public removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const formValue = this.form.value;
    const formData: TaskFormData = {
      title: formValue.title || '',
      description: formValue.description || '',
      dueDate: formValue.dueDate || undefined,
      subtasks: (formValue.subtasks || [])
        .filter((subtask: any) => subtask?.title?.trim())
        .map((subtask : any) => ({ title: subtask.title, isCompleted: subtask.isCompleted || false })),
      status: formValue.status || 'todo',
    };
    
    this.taskUpdated.emit(formData);
  }

  public onCancel() {
    this.canceled.emit();
  }
}
