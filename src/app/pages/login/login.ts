import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '../../core/services/Toast/toast-service';
import { LoadingService } from '../../core/services/loading/loading-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUserDate } from '../../shared/interfaces/auth/user-data/IUserPayload';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly loadingService = inject(LoadingService);
  private readonly destroyRef = inject(DestroyRef);
  loading = signal<boolean>(false);
  success = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  protected loginForm = new FormGroup({
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

  login() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.loadingService.show();
      this.hasError.set(false);
      this.authService
        .login(this.loginForm.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.loading.set(false);
            this.loadingService.hide();
            this.success.set(true);
            const userDate: IUserDate = {
              name: res.user.name,
              email: res.user.email,
              token: res.token,
            };
            this.authService.saveUserData(userDate);

            this.toastr.toast(`Welcome back ${this.authService.currentUser()?.name}`, '', 2000);
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
            setTimeout(() => {
              this.router.navigateByUrl(returnUrl);
            }, 500);
          },
          error: (err: HttpErrorResponse) => {
            this.hasError.set(true);
            this.loading.set(false);
            this.loadingService.hide();
            this.success.set(false);
            this.errorMessage.set(err.error.message || 'Something went wrong');
            //  this.toastr.ToastError(this.errorMessage(), 'Error');
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
