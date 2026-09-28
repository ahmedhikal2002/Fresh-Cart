import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { CurrencyPipe } from '@angular/common';
import { CartSkeleton } from '../../shared/components/skeleton/cart-skeleton/cart-skeleton';
import { ToastService } from '../../core/services/Toast/toast-service';
import { Product } from '../../shared/interfaces/cart/IAddToCartResponse';
import { SweetAlert } from '../../core/services/sweet-alert/sweet-alert';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface states {
  loading: boolean;
  error: boolean;
  errorMessage: string;
}
@Component({
  selector: 'app-cart',
  imports: [ErrorUiComponent, ReactiveFormsModule, CurrencyPipe, CartSkeleton, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  protected cartService = inject(CartService);
  toastr = inject(ToastService);
  sweetAlert2 = inject(SweetAlert);
  clearLoading = signal(false);
  clearError = signal(false);
  clearErrorMessage = signal('');
  //Coupon states
  loadCoupon = signal(false);
  errorCoupon = signal<boolean>(false);
  errMsgCoupon = signal<string>('');
  //cart states
  loadingCart = signal(false);
  errorCart = signal<boolean>(false);
  errMsgCart = signal<string>('');
  //Remove cart states
  loadingRemoveCart = signal(false);
  errorRemoveCart = signal<boolean>(false);
  errMsgRemoveCart = signal<string>('');
  //increase
  errorIncreaseCart = signal<boolean>(false);
  errMsgIncreaseCart = signal<string>('');
  //decrease
  errorDecreaseCart = signal<boolean>(false);
  errMsgDecreaseCart = signal<string>('');

  countControlsDisabled = signal<string | null>(null);

  private destroyRef = inject(DestroyRef);
  protected couponForm = new FormGroup({
    couponName: new FormControl('', { validators: [Validators.required] }),
  });

  applyCoupon() {
    const couponName = this.couponForm.controls.couponName.value?.trim();
    const coupon = this.couponForm.controls.couponName;
    this.errMsgCoupon.set('');
    this.errorCoupon.set(false);
    this.loadCoupon.set(true);
    if (coupon.hasError('notExist')) {
      const { notExist, ...errors } = coupon.errors!;
      coupon.setErrors(Object.keys(errors).length ? errors : null);
    }
    if (this.couponForm.valid) {
      if (!couponName) {
        return;
      }
      this.cartService
        .applyCoupon(couponName)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.loadCoupon.set(false);
            this.errorCoupon.set(false);
            this.errMsgCoupon.set('');
            this.cartService.cart.set(res.data);

            this.toastr.toastSuccess('Coupon applied successfully');
          },

          error: (err: HttpErrorResponse) => {
            this.loadCoupon.set(false);
            this.errorCoupon.set(true);
            coupon.setErrors({ ...coupon.errors, notExist: true });
            this.errMsgCoupon.set(err.error?.message || err.message || 'Failed to apply coupon');
          },
        });
    } else {
      this.loadCoupon.set(false);
      this.errorCoupon.set(false);
      this.errMsgCoupon.set('');
      this.couponForm.markAllAsTouched();
    }
  }

  loadCart() {
    this.loadingCart.set(true);
    this.errorCart.set(false);
    this.errMsgCart.set('');
    this.cartService
      .getLoggedUserCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loadingCart.set(false);
          this.errorCart.set(false);
          this.errMsgCart.set('');
          this.cartService.cart.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.loadingCart.set(false);
          this.errorCart.set(true);
          this.errMsgCart.set(err.error?.message || err.message || 'Failed to load your cart');
        },
      });
  }

  async confirmDelete(product: Product) {
    const confirmed = await this.sweetAlert2.confirmDelete(
      `Remove ${product.title}?`,
      'This item will be removed from your cart.',
    );
    if (confirmed) this.removeFromCart(product);
  }

  async confirmClear() {
    const confirmed = await this.sweetAlert2.confirmDelete();
    if (confirmed) this.clearCart();
  }

  removeFromCart(product: Product) {
    this.loadingRemoveCart.set(true);
    this.errorRemoveCart.set(false);
    this.errMsgRemoveCart.set('');
    const prevCart = this.cartService.cart();
    this.cartService.deleteFromCartOptimistic(product._id);
    this.cartService
      .removeProductFromCart(product._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loadingRemoveCart.set(false);
          this.errorRemoveCart.set(false);
          this.errMsgRemoveCart.set('');
          this.cartService.cart.set(res.data);
          this.sweetAlert2.success('Deleted successfully');
        },
        error: (err: HttpErrorResponse) => {
          this.cartService.cart.set(prevCart);
          this.loadingRemoveCart.set(false);
          this.errorRemoveCart.set(true);

          this.errMsgRemoveCart.set(
            err.error?.message || err.message || `Failed to Remove ${product.title}`,
          );
          this.sweetAlert2.error(this.errMsgRemoveCart());
        },
      });
  }

  increaseCartCount(id: string, count: number) {
    this.countControlsDisabled.set(id + 'increase');
    this.errorIncreaseCart.set(false);
    this.errMsgIncreaseCart.set('');
    const prevCart = this.cartService.cart();
    this.cartService.increaseProductQuantityOptimistic(id);

    this.cartService
      .updateCartProductQuantity(id, count + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.countControlsDisabled.set(null);
          this.errorIncreaseCart.set(false);
          this.errMsgIncreaseCart.set('');
          this.cartService.cart.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.countControlsDisabled.set(null);
          this.errorIncreaseCart.set(true);
          this.cartService.cart.set(prevCart);
          this.errMsgIncreaseCart.set(
            err.error?.message || err.message || 'Failed to increase count',
          );
          this.toastr.ToastError(this.errMsgIncreaseCart());
        },
      });
  }

  decreaseCartCount(id: string, count: number) {
    this.countControlsDisabled.set(id + 'decrease');
    this.errorDecreaseCart.set(false);
    this.errMsgDecreaseCart.set('');
    const prevCart = this.cartService.cart();
    this.cartService.decreaseProductQuantityOptimistic(id);

    this.cartService
      .updateCartProductQuantity(id, count - 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.errorDecreaseCart.set(false);
          this.errMsgDecreaseCart.set('');
          this.countControlsDisabled.set(null);
          this.cartService.cart.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.countControlsDisabled.set(null);
          this.cartService.cart.set(prevCart);
          this.errorDecreaseCart.set(true);
          this.errMsgDecreaseCart.set(
            err.error?.message || err.message || 'Failed to decrease count',
          );
          this.toastr.ToastError(this.errMsgDecreaseCart());
        },
      });
  }

  clearCart() {
    this.clearError.set(false);
    this.clearErrorMessage.set('');
    this.clearLoading.set(true);
    const prevCart = this.cartService.cart();
    this.cartService.clearCartOptimistic();
    this.cartService
      .ClearUserCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.clearError.set(false);
          this.clearErrorMessage.set('');
          this.clearLoading.set(false);
          this.cartService.cart.set(res.data);
          this.toastr.toastSuccess('Cart cleared successfully');
        },
        error: (err: HttpErrorResponse) => {
          this.clearError.set(true);

          this.clearLoading.set(false);
          this.clearErrorMessage.set(err.error?.message || err.message || 'Failed To Clear Cart !');
          this.toastr.ToastError(this.clearErrorMessage());
          this.cartService.cart.set(prevCart);
        },
      });
  }

  ngOnInit(): void {
    this.loadCart();
  }
}
