import { Component, output, inject, input, computed } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { SelectComponent } from '../../../../shared/components/select/select';
import { DateInputComponent } from '../../../../shared/components/date-input/date-input';
import { BoardService } from '../../../../core/services';
import { TaskValidators } from '../../../../core/validators';
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

  public boardId = input<number>(1);

  private existingTitles = computed(() => {
    const board = this.boardService.getBoardDataByIndex(this.boardId() - 1);
    const titles: string[] = [];
    board?.columns?.forEach((col) => {
      col.tasks.forEach((task) => titles.push(task.title));
    });
    return titles;
  });

  form = this.formbuilder.group({
    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        TaskValidators.noWhitespace(),
        TaskValidators.minLength(3),
      ],
    ],
    description: ['', Validators.maxLength(500)],
    dueDate: ['', TaskValidators.futureDate()],
    status: ['', Validators.required],
    subtasks: this.formbuilder.array<any>([]),
  });

  constructor() {
    this.form.get('title')?.addValidators(TaskValidators.duplicateTitle(this.existingTitles()));
  }

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
