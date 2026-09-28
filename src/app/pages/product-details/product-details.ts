import { Component, DestroyRef, OnInit, ViewChild, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProductsService } from '../../core/services/products/products-service';
import { AuthService } from '../../core/services/auth/auth-service';
import { CartService } from '../../core/services/cart/cart-service';
import { ToastService } from '../../core/services/Toast/toast-service';
import { ReviewService } from '../../core/services/reviews/review-service';

import { IProduct } from '../../shared/interfaces/products/IProduct';
import { IReview } from '../../shared/interfaces/reviews/reviews';

import { ProductDetailsSkeleton } from '../../shared/components/skeleton/product-details-skeleton/product-details-skeleton';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { ReviewCard } from '../../shared/components/logic/review-card/review-card';
import { PaginationComponent } from '../../shared/components/logic/pagination-component/pagination-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductReviewsSkeleton } from '../../shared/components/skeleton/product-reviews-skeleton/product-reviews-skeleton';
import { CardProduct } from '../../shared/components/logic/card-product/card-product';
import { WishlistService } from '../../core/services/wishlist/wishlist-service';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    ProductReviewsSkeleton,
    ProductDetailsSkeleton,
    ErrorUiComponent,
    ReviewCard,
    DecimalPipe,
    PaginationComponent,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly reviewService = inject(ReviewService);
  protected readonly wishlistService = inject(WishlistService);
  private readonly toastr = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected productData = signal<IProduct>({} as IProduct);
  protected productImgs = signal<string[]>([]);
  protected activeImg = signal<string>('');
  protected productId = signal<string>('');
  protected quantity = signal<number>(1);
  protected countControlsDisabled = signal<string | null>(null);
  protected productLoading = signal(false);
  protected productError = signal(false);
  protected productErrorMessage = signal('');
  protected addToCartDisabled = signal<string | null>(null);
  protected reviews = signal<IReview[]>([]);
  protected reviewsLoading = signal(false);
  protected reviewsError = signal(false);
  protected reviewsErrorMessage = signal('');
  protected readonly reviewsLimit = 6;
  protected currentPage = signal(1);
  protected numberOfPages = signal(1);

  loadProductData(): void {
    this.productLoading.set(true);
    this.productError.set(false);
    this.productErrorMessage.set('');

    this.productsService
      .getProductById(this.productId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.productLoading.set(false);
          this.productError.set(false);

          this.productData.set(res.data);

          this.activeImg.set(res.data.imageCover);

          this.productImgs.set([res.data.imageCover, ...res.data.images]);
        },

        error: (err: HttpErrorResponse) => {
          this.productLoading.set(false);
          this.productError.set(true);

          this.productErrorMessage.set(
            err.error?.errors?.msg ||
              err.error?.message ||
              err.message ||
              'Failed to load product details',
          );
        },
      });
  }

  changImg(imgSrc: string): void {
    this.activeImg.set(imgSrc);
  }

  incrementQty() {
    if (this.quantity() < this.productData().quantity) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCartByQuantity(product: IProduct) {
    if (!this.authService.currentUser()) {
      this.toastr.toastWarning('Please login first to complete this action');

      this.router.navigateByUrl('/login');

      return;
    }
    const prevCart = this.cartService.cart();
    this.addToCartDisabled.set(product._id);
    this.cartService.addToCartByQuantityOptimistic(product, product.price, this.quantity());

    this.cartService.addToCartByQuantity(product._id, this.quantity()).subscribe({
      next: (res) => {
        this.addToCartDisabled.set(null);
        this.cartService.cart.set(res.data);
        this.toastr.toastSuccess(
          `${this.quantity()} x ${product.title || product.slug} added successfully to your cart`,
        );
        this.quantity.set(1);
      },

      error: (err: HttpErrorResponse) => {
        this.addToCartDisabled.set(null);

        // Rollback optimistic update
        this.cartService.cart.set(prevCart);

        this.toastr.ToastError(err.error?.message || 'Failed to add product');
      },
    });
  }

  loadProductReviews(productId: string, page: number = 1, limit: number = this.reviewsLimit): void {
    this.reviewsLoading.set(true);
    this.reviewsError.set(false);
    this.reviewsErrorMessage.set('');

    this.reviewService
      .getReviewsForPRoduct(productId, page, limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.reviewsLoading.set(false);
          this.reviewsError.set(false);

          this.reviews.set(res.data);

          this.currentPage.set(res.metadata.currentPage);

          this.numberOfPages.set(res.metadata.numberOfPages);
        },

        error: (err: HttpErrorResponse) => {
          this.reviewsLoading.set(false);
          this.reviewsError.set(true);

          this.reviewsErrorMessage.set(
            err.error?.message || err.message || 'Failed to load product reviews',
          );
        },
      });
  }

  scrollToReviewsSection() {
    const reviewsSection = document.getElementById('reviews');
    const clientY = reviewsSection?.getBoundingClientRect().top;

    window.scrollTo({ behavior: 'smooth', left: 0, top: clientY ? clientY - 80 : 0 });
  }

  goToPage(page: number): void {
    this.loadProductReviews(this.productId(), page, this.reviewsLimit);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        const id = params.get('id');

        if (!id) {
          return;
        }

        this.productId.set(id);

        this.loadProductData();

        this.loadProductReviews(id, 1, this.reviewsLimit);
      },
    });
  }
}
