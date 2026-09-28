import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/Toast/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { noWhitespace } from '../../shared/validators/custom-validators';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  toastr = inject(ToastService);
  protected registerForm = new FormGroup(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          noWhitespace(),
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)],
      }),
      rePassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)],
      }),
    },
    { validators: [this.validatePasswordConfirmation] },
  );

  validatePasswordConfirmation(controls: AbstractControl): ValidationErrors | null {
    const password = controls.get('password');
    const rePassword = controls.get('rePassword');

    if (!password || !rePassword) return null;

    if (password.errors) {
      rePassword.setErrors({ ...rePassword.errors, invalidPassword: true });
      return { invalidPassword: true };
    }

    if (password.value === rePassword.value) {
      rePassword.setErrors(null);
      return null;
    } else {
      rePassword.setErrors({ ...rePassword.errors, mismatch: true });
      return { mismatch: true };
    }
  }

  getInputClasses(control: AbstractControl | null) {
    const hasError = control?.invalid && control?.touched;
    const isValid = control?.valid && control?.touched;

    return {
      'bg-red-100 dark:bg-red-900/30!': hasError,
      'border-red-500 dark:border-red-400!': hasError,
      'text-red-600 dark:text-red-400!': hasError,
      'focus:border-red-500 dark:focus:border-red-400!': hasError,
      'focus:ring-red-600/40 dark:focus:ring-red-400/40!': hasError,
      'border-main-color': isValid,
      'text-green-600! dark:text-green-400!': isValid,
      'bg-green-100 dark:bg-green-900/30!': isValid,
      'focus:border-main-color': isValid,
      'focus:ring-main-color/40': isValid,
    };
  }

  register() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.hasError.set(false);
      this.authService
        .signUp(this.registerForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.loading.set(false);
            this.success.set(true);

            this.toastr.toastSuccess(' Account created successfully! Please login to continue.');
            //success
            this.router.navigate(['/login']);
          },
          error: (res) => {
            this.hasError.set(true);
            this.loading.set(false);
            this.success.set(false);
            this.errorMessage = res.error.message;
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      this.loading.set(false);
      this.hasError.set(false);
      this.success.set(false);
    }
  }
}
