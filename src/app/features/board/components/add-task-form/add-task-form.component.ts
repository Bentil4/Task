import { Component, output, inject, input, computed, HostListener } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { InputComponent } from '../../../../shared/components';
import { TextareaComponent } from '../../../../shared/components';
import { SelectComponent } from '../../../../shared/components';
import { DateInputComponent } from '../../../../shared/components';
import { BoardService } from '../../../../core/services';
import { TaskValidators } from '../../../../core/validators';
import { ISelectOption, ITaskFormData } from '../../../../core/models';
import { FormErrorHelper } from '../../../../core/utils';

@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.css',
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
  isSubmitting = input<boolean>(false);

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
    subtasks: this.formbuilder.array<AbstractControl<string>>([]),
  });

  constructor() {
    this.form.get('title')?.addValidators(TaskValidators.duplicateTitle(this.existingTitles()));
  }
  
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.onCancel();
  }
  
  @HostListener('document:keydown.control.enter')
  @HostListener('document:keydown.meta.enter')
  onSubmitShortcut() {
    if (!this.form.invalid && !this.isSubmitting()) {
      this.onSubmit();
    }
  }

  public statusOptions = computed<ISelectOption[]>(() => {
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

  public taskCreated = output<ITaskFormData>();
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
  
  getErrorMessage(field: string): string {
    return FormErrorHelper.getErrorMessage(this.form.get(field), field);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const subtasksArray = formValue.subtasks as string[];
    const formData: ITaskFormData = {
      title: formValue.title || '',
      description: formValue.description || '',
      dueDate: formValue.dueDate || undefined,
      subtasks: subtasksArray
        .filter((title) => title?.trim())
        .map((title) => ({ title, isCompleted: false })),
      status: formValue.status || 'todo',
    };

    this.taskCreated.emit(formData);
    this.resetForm();
  }

  resetForm(): void {
    this.form.reset();
    this.subtasks.clear();
  }

  public onCancel() {
    this.canceled.emit();
  }
}
