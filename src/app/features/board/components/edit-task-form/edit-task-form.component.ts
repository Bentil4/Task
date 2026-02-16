import { Component, output, input, effect, inject, computed, HostListener } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { InputComponent } from '../../../../shared/components';
import { TextareaComponent } from '../../../../shared/components';
import { SelectComponent } from '../../../../shared/components';
import { DateInputComponent } from '../../../../shared/components';
import { BoardService } from '../../../../core/services';
import { TaskValidators } from '../../../../core/validators';
import type { ISelectOption, ITask, ITaskFormData } from '../../../../core/models';
import { FormErrorHelper } from '../../../../core/utils';

@Component({
  selector: 'app-edit-task-form',
  templateUrl: './edit-task-form.component.html',
  styleUrl: './edit-task-form.component.css',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DateInputComponent,
  ],
})
export class EditTaskFormComponent {
  private fb = inject(FormBuilder);
  private boardService = inject(BoardService);

  task = input<ITask | null>(null);
  boardId = input<number>(1);
  isSubmitting = input<boolean>(false);
  
  taskDeleted = output<void>();
  
  get isDirty(): boolean {
    return this.form.dirty;
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

  private existingTitles = computed(() => {
    const board = this.boardService.getBoardDataByIndex(this.boardId() - 1);
    const titles: string[] = [];
    board?.columns?.forEach((col) => {
      col.tasks.forEach((t) => titles.push(t.title));
    });
    return titles;
  });

  form = this.fb.group({
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
    subtasks: this.fb.array<FormGroup>([]),
  });

  public statusOptions = computed<ISelectOption[]>(() => {
    const board = this.boardService.getBoardDataByIndex(this.boardId() - 1);
    return (
      board?.columns?.map((col) => ({
        label: col.name,
        value: col.name.toLowerCase(),
      })) ?? [
        { label: 'Todo', value: 'todo' },
        { label: 'Doing', value: 'doing' },
        { label: 'Done', value: 'done' },
      ]
    );
  });

  public taskUpdated = output<ITaskFormData>();
  public canceled = output<void>();

  get subtasks() {
    return this.form.get('subtasks') as FormArray<FormGroup>;
  }

  constructor() {
    effect(() => {
      const taskData = this.task();
      if (taskData) {
        this.form.get('title')?.clearValidators();
        this.form
          .get('title')
          ?.setValidators([
            Validators.required,
            Validators.maxLength(100),
            TaskValidators.noWhitespace(),
            TaskValidators.minLength(3),
            TaskValidators.duplicateTitle(this.existingTitles(), taskData.title),
          ]);

        this.form.patchValue({
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate || '',
          status: taskData.status.toLowerCase(),
        });

        this.subtasks.clear();
        taskData.subtasks.forEach((st) => {
          this.subtasks.push(
            this.fb.group({
              title: new FormControl(st.title),
              isCompleted: new FormControl(st.isCompleted),
            }),
          );
        });
      }
    });
  }
  
  getErrorMessage(field: string): string {
    return FormErrorHelper.getErrorMessage(this.form.get(field), field);
  }

  public addSubtask() {
    this.subtasks.push(
      this.fb.group({
        title: new FormControl(''),
        isCompleted: new FormControl(false),
      }),
    );
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
    const formData: ITaskFormData = {
      title: formValue.title || '',
      description: formValue.description || '',
      dueDate: formValue.dueDate || undefined,
      subtasks: (formValue.subtasks || [])
        .filter((st: { title?: string; isCompleted?: boolean }) => st?.title?.trim())
        .map((st: { title?: string; isCompleted?: boolean }) => ({ 
          title: st.title || '', 
          isCompleted: st.isCompleted || false 
        })),
      status: formValue.status || 'todo',
    };

    this.taskUpdated.emit(formData);
  }

  public onCancel() {
    this.canceled.emit();
  }

  public onDelete() {
    this.taskDeleted.emit();
  }

  public toggleSubtaskCompletion(index: number) {
    const subtask = this.subtasks.at(index);
    if (subtask) {
      const currentValue = subtask.get('isCompleted')?.value;
      subtask.patchValue({ isCompleted: !currentValue });
    }
  }
}
