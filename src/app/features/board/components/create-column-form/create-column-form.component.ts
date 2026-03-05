import { Component, output, inject, input, HostListener } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components';
import { TaskValidators } from '../../../../core/validators';
import type { IColumn } from '../../../../core/models';
import { FormErrorHelper } from '../../../../core/utils';

@Component({
  selector: 'app-create-column-form',
  templateUrl: './create-column-form.component.html',
  styleUrl: './create-column-form.component.css',
  imports: [ReactiveFormsModule, InputComponent],
})
export class CreateColumnFormComponent {
  private fb = inject(FormBuilder);

  isSubmitting = input<boolean>(false);
  columnCreated = output<IColumn>();
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

    const columnName = this.form.value.name?.trim() || '';
    if (!columnName) return;
    
    const newColumn: IColumn = {
      name: columnName,
      tasks: [],
    };

    this.columnCreated.emit(newColumn);
    this.form.reset();
    this.form.markAsPristine();
  }

  public onCancel() {
    this.canceled.emit();
  }
}
