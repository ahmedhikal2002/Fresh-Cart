import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile/profile-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../core/services/Toast/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { noWhitespace } from '../../../validators/custom-validators';
import { IUserDate } from '../../../interfaces/auth/user-data/IUserPayload';
import { AuthService } from '../../../../core/services/auth/auth-service';

@Component({
  selector: 'app-edit-profile',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile {
  private readonly fromBuilder = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly toastr = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  errMsg = signal<string>('');
  closeEditProfile = output<void>();
  protected editProfileFrom = this.fromBuilder.nonNullable.group({
    name: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          noWhitespace(),
        ],
      },
    ],
    email: [
      '',
      {
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      },
    ],

    phone: ['', { validators: [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)] }],
  });

  editProfile() {
    this.loading.set(true);
    this.error.set(false);
    this.errMsg.set('');
    const { name, email, phone } = this.editProfileFrom.getRawValue();
    this.profileService
      .UpdateLoggedUserData(name, email, phone)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.errMsg.set('');
          this.editProfileFrom.reset();
          this.toastr.toastSuccess('profile has been updated successfully');
          this.closeEditProfile.emit();
          const user = this.authService.retrieveUser();
          const userData: IUserDate = {
            name: res.user.name,
            email: res.user.email,
            token: user?.token ?? '',
          };
          this.authService.saveUserData(userData);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errMsg.set(err.error.errors.msg ?? err.message ?? 'Failed to update');
        },
      });
  }

  editProfileSubmit() {
    if (this.editProfileFrom.valid) {
      this.editProfile();
    } else {
      this.editProfileFrom.markAllAsTouched();
    }
  }
}
