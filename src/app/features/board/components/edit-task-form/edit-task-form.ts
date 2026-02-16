import { Component, output, input, effect, inject, computed } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { SelectComponent } from '../../../../shared/components/select/select';
import { DateInputComponent } from '../../../../shared/components/date-input/date-input';
import { BoardService } from '../../../../core/services';
import { TaskValidators } from '../../../../core/validators';
import type { SelectOption } from '../../../../shared/components/select/select';
import type { ITask } from '../../../../core/models';
import type { TaskFormData } from '../add-task-form/add-task-form';

@Component({
  selector: 'app-edit-task-form',
  templateUrl: './edit-task-form.html',
  styleUrl: './edit-task-form.css',
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
    subtasks: this.fb.array<any>([]),
  });

  public statusOptions = computed<SelectOption[]>(() => {
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

  public taskUpdated = output<TaskFormData>();
  public canceled = output<void>();

  get subtasks() {
    return this.form.get('subtasks') as FormArray;
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
              title: [st.title],
              isCompleted: [st.isCompleted],
            }),
          );
        });
      }
    });
  }

  public addSubtask() {
    this.subtasks.push(
      this.fb.group({
        title: [''],
        isCompleted: [false],
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
    const formData: TaskFormData = {
      title: formValue.title || '',
      description: formValue.description || '',
      dueDate: formValue.dueDate || undefined,
      subtasks: (formValue.subtasks || [])
        .filter((st: any) => st?.title?.trim())
        .map((st: any) => ({ title: st.title, isCompleted: st.isCompleted || false })),
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
