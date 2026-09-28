import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile/profile-service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { ToastService } from '../../../../core/services/Toast/toast-service';
import { IUserDate } from '../../../interfaces/auth/user-data/IUserPayload';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  private readonly fromBuilder = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  errMsg = signal<string>('');
  closeFrom = output<void>();
  protected changePasswordFrom = this.fromBuilder.nonNullable.group(
    {
      currentPassword: [
        '',
        { validators: [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)] },
      ],
      password: ['', { validators: [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)] }],
      rePassword: ['', { validators: [Validators.required] }],
    },
    { validators: [this.validateRePassword, this.validatePassword] },
  );

  private validatePassword(controls: AbstractControl): ValidationErrors | null {
    const currentPassword = controls.get('currentPassword')?.value;
    const password = controls.get('password')?.value;

    if (!currentPassword || !password) {
      return null;
    }

    return currentPassword === password ? { sameValue: true } : null;
  }
  private validateRePassword(controls: AbstractControl): ValidationErrors | null {
    const password = controls.get('password')?.value;
    const rePassword = controls.get('rePassword')?.value;

    if (!password || !rePassword) {
      return null;
    }

    return password !== rePassword ? { mismatch: true } : null;
  }

  updatePassword() {
    this.loading.set(true);
    this.error.set(false);
    this.errMsg.set('');

    const { currentPassword, password, rePassword } = this.changePasswordFrom.getRawValue();
    this.profileService
      .updateLoggedUserPassword(currentPassword, password, rePassword)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.errMsg.set('');
          // localStorage.removeItem('token');
          const userData: IUserDate = {
            email: res.user.email,
            name: res.user.name,
            token: res.token,
          };
          this.authService.saveUserData(userData);
          this.toastr.toastSuccess('password has been changed successfully');
          this.changePasswordFrom.reset();
          this.closeFrom.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errMsg.set(err.error?.errors?.msg ?? err.message ?? 'Failed to update password');
        },
      });
  }

  updatePasswordSubmit() {
    if (this.changePasswordFrom.valid) {
      this.updatePassword();
    } else {
      this.changePasswordFrom.markAllAsTouched();
    }
  }
}
