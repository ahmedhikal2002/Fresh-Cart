import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart-service';
import { CheckoutService } from '../../core/services/checkout/checkout-service';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { CheckoutSkeleton } from '../../shared/components/skeleton/checkout-skeleton/checkout-skeleton';
import { ProfileService } from '../../core/services/profile/profile-service';
import { IAddress } from '../../shared/interfaces/profile/profile';
import { noWhitespace } from '../../shared/validators/custom-validators';

type paymentMethod = 'cash' | 'visa';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, ErrorUiComponent, CheckoutSkeleton, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartId = signal<string>('');
  private readonly profileService = inject(ProfileService);
  userAddress = signal<IAddress>({} as IAddress);
  loadingCart = signal(false);
  errorCart = signal(false);
  errMsgCart = signal('');
  processingOrder = signal(false);
  totalPrice = signal(0);
  errorCashOrder = signal<boolean>(false);
  cashOrderMessageError = signal<string>('');
  errorOnlineOrder = signal<boolean>(false);
  onlineOrderMessageError = signal<string>('');

  protected checkoutForm = new FormGroup({
    details: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, noWhitespace()],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)],
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, noWhitespace()],
    }),
    postalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{5}$/)],
    }),
    paymentMethod: new FormControl<paymentMethod>('cash', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get details() {
    return this.checkoutForm.get('details');
  }
  get phone() {
    return this.checkoutForm.get('phone');
  }
  get city() {
    return this.checkoutForm.get('city');
  }
  get postalCode() {
    return this.checkoutForm.get('postalCode');
  }
  get paymentMethod() {
    return this.checkoutForm.get('paymentMethod');
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
          this.cartId.set(res.cartId);
          this.cartService.cart.set(res.data);
          this.totalPrice.set(res.data.totalCartPrice);
          if (res.data.products.length === 0) {
            this.toastr.info('Your cart is empty');
            this.router.navigate(['/cart'], { replaceUrl: true });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loadingCart.set(false);
          this.errorCart.set(true);
          this.errMsgCart.set(err.error?.message || err.message || 'Failed to load cart');
        },
      });
  }

  createPayment() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const method = this.paymentMethod?.getRawValue();

    if (method === 'cash') {
      this.createCashOrder();
    } else if (method === 'visa') {
      this.createOnlinePayment();
    }
  }

  private createCashOrder() {
    this.processingOrder.set(true);
    this.cashOrderMessageError.set('');
    this.errorCashOrder.set(false);
    this.checkoutService
      .CreateCashOrderFromCart(this.cartId(), {
        city: this.city?.getRawValue(),
        details: this.details?.getRawValue(),
        phone: this.phone?.getRawValue(),
        postalCode: this.postalCode?.getRawValue(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.processingOrder.set(false);
          this.cashOrderMessageError.set('');
          this.errorCashOrder.set(false);
          this.toastr.success(res.message || 'Order placed successfully');
          this.cartService.clearCartOptimistic();
          this.router.navigate(['/allorders'], { replaceUrl: true });
        },
        error: (err: HttpErrorResponse) => {
          this.processingOrder.set(false);
          this.cashOrderMessageError.set(
            err.error?.message || err.message || 'Failed to place order',
          );
          this.errorCashOrder.set(true);
        },
      });
  }

  private createOnlinePayment() {
    this.processingOrder.set(true);
    this.onlineOrderMessageError.set('');
    this.errorOnlineOrder.set(false);
    this.checkoutService
      .CreateOnlinePayment(this.cartId(), {
        city: this.city?.getRawValue(),
        details: this.details?.getRawValue(),
        phone: this.phone?.getRawValue(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.processingOrder.set(false);
          this.onlineOrderMessageError.set('');
          this.errorOnlineOrder.set(false);
          const checkoutUrl = res.session?.url;

          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            this.toastr.error('Unable to start the payment session');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.processingOrder.set(false);
          this.onlineOrderMessageError.set(err.error?.message || err.message || 'Payment failed');
          this.errorOnlineOrder.set(true);
        },
      });
  }

  loadUSerAddress() {
    this.profileService
      .getLoggedUserAddresses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          res.status === 'success' && this.userAddress.set(res.data[res.data.length - 1]);
          const { city, details, phone } = this.checkoutForm.controls;
          city.setValue(this.userAddress().city);
          details.setValue(this.userAddress().details);
          phone.setValue(this.userAddress().phone);
        },
        error: (err: HttpErrorResponse) => {},
      });
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
      this.loadUSerAddress();
    }
  }
}
