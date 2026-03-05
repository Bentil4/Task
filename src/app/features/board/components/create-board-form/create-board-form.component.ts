import { Component, output, inject, input, HostListener } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components';
import { TaskValidators } from '../../../../core/validators';
import { FormErrorHelper } from '../../../../core/utils';

@Component({
  selector: 'app-create-board-form',
  templateUrl: './create-board-form.component.html',
  styleUrl: './create-board-form.component.css',
  imports: [ReactiveFormsModule, InputComponent],
})
export class CreateBoardFormComponent {
  private fb = inject(FormBuilder);

  isSubmitting = input<boolean>(false);
  boardCreated = output<string>();
  canceled = output<void>();

  form = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        TaskValidators.noWhitespace(),
      ],
    ],
  });

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

  getErrorMessage(field: string): string {
    return FormErrorHelper.getErrorMessage(this.form.get(field), field);
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const boardName = this.form.value.name?.trim() || '';
    if (!boardName) return;

    this.boardCreated.emit(boardName);
    this.form.reset();
    this.form.markAsPristine();
  }

  public onCancel() {
    this.canceled.emit();
  }
}
