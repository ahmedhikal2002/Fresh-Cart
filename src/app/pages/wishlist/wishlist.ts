import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist-service';
import { IProduct } from '../../shared/interfaces/products/IProduct';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { AllProductsSkeleton } from '../../shared/components/skeleton/all-products-skeleton/all-products-skeleton';
import { CardProduct } from '../../shared/components/logic/card-product/card-product';
import { EmptyStateComponent } from '../../shared/components/ui/empty-state-component/empty-state-component';
import { ProductsSkeleton } from '../../shared/components/skeleton/products-skeleton/products-skeleton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-wishlist',
  imports: [ErrorUiComponent, CardProduct, EmptyStateComponent, ProductsSkeleton],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist implements OnInit {
  protected readonly wishlistService = inject(WishlistService);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  errorMsg = signal<string>('');
  private destroyRef = inject(DestroyRef);
  loadWishList() {
    this.loading.set(true);
    this.error.set(false);
    this.errorMsg.set('');
    this.wishlistService
      .getLoggedUserWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.errorMsg.set('');

          this.wishlistService.wishList.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errorMsg.set(err.error?.message || err.message || 'Failed to load wishlist');
        },
      });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.wishlistService.wishList() !== null) {
      return;
    }
    this.loadWishList();
  }
}
