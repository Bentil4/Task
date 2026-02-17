import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormErrorHelper {
  static getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control?.errors || !control.touched) return '';

    const errors: ValidationErrors = control.errors;
    const value = control.value || '';
    const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

    if (errors['required']) return `${capitalizedField} is required`;
    if (errors['whitespace']) return 'Cannot be empty or whitespace';
    if (errors['minlength']) {
      return `Must be at least ${errors['minlength'].requiredLength} characters (${value.length}/${errors['minlength'].requiredLength})`;
    }
    if (errors['maxlength']) {
      return `Must be less than ${errors['maxlength'].requiredLength} characters (${value.length}/${errors['maxlength'].requiredLength})`;
    }
    if (errors['duplicate']) return 'A task with this title already exists';
    if (errors['pastDate']) return 'Due date cannot be in the past';

    return '';
  }
}
