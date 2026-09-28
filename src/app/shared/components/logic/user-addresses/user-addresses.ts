import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IAddress } from '../../../interfaces/profile/profile';
import { ProfileService } from '../../../../core/services/profile/profile-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core/services/Toast/toast-service';
import { SweetAlert } from '../../../../core/services/sweet-alert/sweet-alert';
import { ErrorUiComponent } from '../../ui/error/error-ui-component/error-ui-component';
import { UserAddressesSkeleton } from '../../skeleton/user-addresses-skeleton/user-addresses-skeleton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { noWhitespace } from '../../../validators/custom-validators';

@Component({
  selector: 'app-user-addresses',
  imports: [ReactiveFormsModule, ErrorUiComponent, UserAddressesSkeleton],
  templateUrl: './user-addresses.html',
  styleUrl: './user-addresses.scss',
})
export class UserAddresses implements OnInit {
  getAddressLoading = signal<boolean>(false);
  getAddressError = signal<boolean>(false);
  getAddressErrorMsg = signal<string>('');
  addAddress = signal<boolean>(false);
  addAddressLoading = signal<boolean>(false);
  addAddressError = signal<boolean>(false);
  addAddressErrorMsg = signal<string>('');
  private readonly toastr = inject(ToastService);
  protected userAddresses = signal<IAddress[]>([]);
  protected readonly profileService = inject(ProfileService);
  private readonly fromBuilder = inject(FormBuilder);
  private readonly sweetAlert = inject(SweetAlert);
  private readonly destroyRef = inject(DestroyRef);
  protected addAddressFrom = this.fromBuilder.nonNullable.group({
    name: ['', { validators: [Validators.required, noWhitespace()] }],
    details: ['', { validators: [Validators.required, Validators.minLength(5), noWhitespace()] }],
    phone: [
      '',
      {
        validators: [
          Validators.required,
          Validators.pattern(/^01[0125]\d{8}$/),
          Validators.maxLength(11),
        ],
      },
    ],
    city: ['', { validators: [Validators.required, Validators.minLength(3), noWhitespace()] }],
  });
  loadUSerAddress() {
    this.getAddressLoading.set(true);
    this.getAddressError.set(false);
    this.getAddressErrorMsg.set('');
    this.profileService
      .getLoggedUserAddresses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.getAddressLoading.set(false);
          this.getAddressError.set(false);
          this.getAddressErrorMsg.set('');
          res.status === 'success' && this.userAddresses.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.getAddressLoading.set(false);
          this.getAddressError.set(true);
          this.getAddressErrorMsg.set(
            err.error?.message || err.message || 'Failed to load address',
          );
        },
      });
  }
  toggleAddressState() {
    return this.addAddress.update((state) => !state);
  }
  addUserAddress() {
    const address = this.addAddressFrom.getRawValue();
    this.addAddressLoading.set(true);
    this.addAddressError.set(false);
    this.addAddressErrorMsg.set('');
    this.profileService.addAddress(address).subscribe({
      next: (res) => {
        this.addAddressLoading.set(false);
        this.addAddressError.set(false);
        this.addAddressErrorMsg.set('');
        this.addAddress.set(false);
        this.addAddressFrom.reset();
        this.userAddresses.update((prev) => [...res.data]);
        res.status === 'success' && this.toastr.toastSuccess(res.message);
      },
      error: (err: HttpErrorResponse) => {
        this.addAddressLoading.set(false);
        this.addAddressError.set(true);
        this.addAddressErrorMsg.set(err.error?.message || err.message || 'Failed to add address');
      },
    });
  }

  addUSerAddressSubmit() {
    if (this.addAddressFrom.valid) {
      this.addUserAddress();
    } else {
      this.addAddressFrom.markAllAsTouched();
    }
  }
  removeUserAddress(addressId: string) {
    this.profileService.removeAddress(addressId).subscribe({
      next: (res) => {
        this.userAddresses.set(res.data);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.ToastError(
          err.error?.message ?? err.message ?? 'Failed to Remove address',
          'Fresh Cart',
        );
      },
    });
  }
  async confirmRemoveAddress(addressId: string) {
    const confirm = await this.sweetAlert.confirmDelete(
      'Remove this address!',
      'This address will be removed from your profile.',
    );
    if (confirm) {
      this.removeUserAddress(addressId);
    } else {
      return;
    }
  }

  ngOnInit(): void {
    this.loadUSerAddress();
  }
}
