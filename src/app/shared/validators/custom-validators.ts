import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespace(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    if (typeof value === 'string' && value.trim().length === 0) {
      return { noWhitespace: true };
    }

    return null;
  };
}
