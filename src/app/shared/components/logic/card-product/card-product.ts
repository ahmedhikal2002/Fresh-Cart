import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductTitlePipe } from '../../../pipes/product-title-pipe';
import { IProduct } from '../../../interfaces/products/IProduct';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { CartService } from '../../../../core/services/cart/cart-service';
import { ToastService } from '../../../../core/services/Toast/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WishlistService } from '../../../../core/services/wishlist/wishlist-service';

@Component({
  selector: 'app-card-product',
  imports: [RouterLink, CurrencyPipe, ProductTitlePipe],
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss',
})
export class CardProduct {
  product = input<IProduct>({} as IProduct);
  protected authService = inject(AuthService);
  private cartService = inject(CartService);
  protected wishListService = inject(WishlistService);
  protected addToCartDisabled = signal<string | null>(null);
  private toastr = inject(ToastService);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  addToCart(product: IProduct) {
    if (this.authService.currentUser()) {
      const prevCart = this.cartService.cart();
      this.addToCartDisabled.set(product._id);
      this.cartService.addToCartOptimistic(product, product.price);
      this.cartService
        .addToCart(product._id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.addToCartDisabled.set(null);

            this.cartService.cart.set(res.data);
            this.toastr.toastSuccess(res?.message ?? 'Product added successfully to your cart');
          },
          error: (err: HttpErrorResponse) => {
            this.addToCartDisabled.set(null);
            this.cartService.cart.set(prevCart);
            this.toastr.ToastError(err.error?.message || 'Failed to add product');
          },
        });
    } else {
      this.toastr.toastWarning('please login first to complete this action');
      this.router.navigateByUrl('/login');
    }
  }

  wishListToggle(product: IProduct) {
    this.wishListService.wishListToggle(product);
  }
}
