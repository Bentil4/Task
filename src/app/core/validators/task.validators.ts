import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TaskValidators {
  public static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  public static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const trimmed = (control.value || '').trim();
      return trimmed.length < min
        ? { minlength: { requiredLength: min, actualLength: trimmed.length } }
        : null;
    };
  }

  public static duplicateTitle(existingTitles: string[], currentTitle?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const title = control.value.trim().toLowerCase();
      const isDuplicate = existingTitles
        .filter((title) => title.toLowerCase() !== currentTitle?.toLowerCase())
        .some((title) => title.toLowerCase() === title);
      return isDuplicate ? { duplicate: true } : null;
    };
  }

  public static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate < today ? { pastDate: true } : null;
    };
  }
}
