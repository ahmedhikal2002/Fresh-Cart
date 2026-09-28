import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/services/Toast/toast-service';
import { LoadingService } from '../../core/services/loading/loading-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUserDate } from '../../shared/interfaces/auth/user-data/IUserPayload';

@Component({
  selector: 'app-forgot-password',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastService);
  private readonly loadingService = inject(LoadingService);
  private readonly destroyRef = inject(DestroyRef);
  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  step = 1;
  protected verifyEmailForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
      ],
    }),
  });

  protected verifyCodeForm = new FormGroup({
    resetCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{5,}$/)],
    }),
  });

  protected restPasswordForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
      ],
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z]\w{5,}$/)],
    }),
  });

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

  verifyEmail() {
    if (this.verifyEmailForm.valid) {
      this.loading.set(true);
      this.hasError.set(false);
      this.success.set(false);
      this.authService
        .verifyEmail(this.verifyEmailForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.loading.set(false);
            this.hasError.set(false);
            this.success.set(true);
            this.toastr.toastSuccess(res.message);
            this.step = 2;
          },
          error: (err: HttpErrorResponse) => {
            this.loading.set(false);
            this.hasError.set(true);
            this.success.set(false);
            this.errorMessage.set(
              err.error.message || 'Some Thing Went Wrong. Please Try Again Later',
            );
            //    this.toastr.ToastError(err.error?.message);
          },
        });
    } else {
      this.verifyEmailForm.markAllAsTouched();
    }
  }

  verifyResetCode() {
    if (this.verifyCodeForm.valid) {
      this.loading.set(true);
      this.hasError.set(false);
      this.success.set(false);
      this.authService
        .verifyResetCode(this.verifyCodeForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.loading.set(false);
            this.hasError.set(false);
            this.success.set(true);
            this.restPasswordForm.patchValue({
              email: this.verifyEmailForm.getRawValue().email,
            });
            res.status === 'Success' &&
              this.toastr.toastSuccess('please enter the new password to login');

            this.step = 3;
          },
          error: (err: HttpErrorResponse) => {
            this.loading.set(false);
            this.hasError.set(true);
            this.success.set(false);
            this.errorMessage.set(
              err.error.message || 'Some Thing Went Wrong. Please Try Again Later',
            );
            //   this.toastr.ToastError(err.error?.message);
          },
        });
    } else {
      this.verifyCodeForm.markAllAsTouched();
    }
  }

  verifyResetPassword() {
    if (this.restPasswordForm.valid) {
      this.loading.set(true);
      this.loadingService.show();
      this.hasError.set(false);
      this.success.set(false);
      this.authService
        .resetPassword(this.restPasswordForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.loading.set(false);
            this.loadingService.hide();
            this.hasError.set(false);
            this.success.set(true);
            const userData = this.authService.userData();
            const user: IUserDate = {
              token: res.token,
              email: userData?.email ?? '',
              name: userData?.name ?? '',
            };
            this.authService.saveUserData(user);
            this.router.navigateByUrl('/home');

            this.toastr.toast('welcome back', this.authService.currentUser()?.name, 3000);
          },
          error: (err: HttpErrorResponse) => {
            this.loading.set(false);
            this.loadingService.hide();
            this.hasError.set(true);
            this.success.set(false);
            this.errorMessage.set(
              err.error.message || 'Some Thing Went Wrong. Please Try Again Later',
            );
            // this.toastr.ToastError(err.error?.message || 'Something went wrong');
          },
        });
    } else {
      this.restPasswordForm.markAllAsTouched();
    }
  }
}
