import { Component, output, inject, input, computed } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { SelectComponent } from '../../../../shared/components/select/select';
import { DateInputComponent } from '../../../../shared/components/date-input/date-input';
import { BoardService } from '../../../../core/services';
import type { SelectOption } from '../../../../shared/components/select/select';

export interface TaskFormData {
  title: string;
  description: string;
  dueDate?: string;
  subtasks: { title: string; isCompleted?: boolean }[];
  status: string;
}

@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.html',
  styleUrl: './add-task-form.css',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DateInputComponent,
  ],
})
export class AddTaskFormComponent {
  private formbuilder = inject(FormBuilder);
  private boardService = inject(BoardService);

  boardId = input<number>(1);

  form = this.formbuilder.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    dueDate: [''],
    status: ['', Validators.required],
    subtasks: this.formbuilder.array<any>([]),
  });

  public statusOptions = computed<SelectOption[]>(() => {
    const board = this.boardService.getBoardDataByIndex(this.boardId() - 1);
    return (
      board?.columns?.map((column) => ({
        label: column.name,
        value: column.name.toLowerCase(),
      })) ?? [
        { label: 'Todo', value: 'todo' },
        { label: 'Doing', value: 'doing' },
        { label: 'Done', value: 'done' },
      ]
    );
  });

  public taskCreated = output<TaskFormData>();
  public canceled = output<void>();

  get subtasks() {
    return this.form.get('subtasks') as FormArray;
  }

  public addSubtask() {
    this.subtasks.push(this.formbuilder.control(''));
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
    const subtasksArray = formValue.subtasks as string[];
    const formData: TaskFormData = {
      title: formValue.title || '',
      description: formValue.description || '',
      dueDate: formValue.dueDate || undefined,
      subtasks: subtasksArray
        .filter((title) => title?.trim())
        .map((title) => ({ title, isCompleted: false })),
      status: formValue.status || 'todo',
    };

    this.taskCreated.emit(formData);
  }

  public onCancel() {
    this.canceled.emit();
  }
}
