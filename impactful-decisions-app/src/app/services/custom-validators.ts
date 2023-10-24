import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const customProConValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const description = formGroup.get('description');
  const rating = formGroup.get('rating');
  const criteria = formGroup.get('criteria');

  if (description?.value && (!rating?.value || !criteria?.value)) {
    return { 'incompletePro': true };
  }
  return null;
};

