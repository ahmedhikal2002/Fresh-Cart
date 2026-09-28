import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AllOrdersService } from '../../core/services/allOrders/all-orders-service';
import { HttpErrorResponse } from '@angular/common/http';
import { IOrderDetails } from '../../shared/interfaces/all-orders/allOrders';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../core/services/reviews/review-service';
import { ICreateReview, IReview } from '../../shared/interfaces/reviews/reviews';
import { AuthService } from '../../core/services/auth/auth-service';
import { SweetAlert } from '../../core/services/sweet-alert/sweet-alert';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderDetailsSkeleton } from '../../shared/components/skeleton/order-details-skeleton/order-details-skeleton';

@Component({
  selector: 'app-order-details',
  imports: [
    DatePipe,
    CurrencyPipe,
    ErrorUiComponent,
    OrderDetailsSkeleton,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails implements OnInit {
  loadingOrder = signal(false);
  errorOrder = signal(false);
  errMsgOrder = signal('');
  loadingReview = signal(false);
  errorReview = signal(false);
  errMsgReview = signal('');
  creatingReview = signal(false);
  createReviewError = signal(false);
  createReviewErrorMessage = signal('');
  updateReviewLoading = signal(false);
  updateReviewError = signal(false);
  updateReviewMsgErr = signal('');
  deleteErrorMsg = signal<string>('');
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(AllOrdersService);
  private readonly reviewService = inject(ReviewService);
  private readonly sweetAlert = inject(SweetAlert);
  private readonly destroyRef = inject(DestroyRef);
  protected order = signal<IOrderDetails>({} as IOrderDetails);
  protected reviewDetails = signal<ICreateReview>({} as ICreateReview);
  protected UserReviewForProduct = signal<IReview[]>([]);
  protected orderProductsIds = signal<string[]>([]);
  addReview = signal<string | null>(null);
  editReview = signal<string | null>(null);
  loadOrderId() {
    const orderId = this.activatedRoute.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(orderId);
    }
  }
  loadOrderDetails(orderId: string) {
    this.loadingOrder.set(true);
    this.errMsgOrder.set('');
    this.errorOrder.set(false);
    this.orderService
      .getOrderDetails(orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loadingOrder.set(false);
          this.errMsgOrder.set('');
          this.errorOrder.set(false);
          this.order.set(res.data);
          const ids = res.data.cartItems.map((item) => item.product._id);
          this.orderProductsIds.set(ids);
          this.getUserReviews();
        },
        error: (err: HttpErrorResponse) => {
          this.loadingOrder.set(false);
          this.errorOrder.set(true);
          this.errMsgOrder.set(
            err.error?.message || err.message || 'Failed to load product details',
          );
        },
      });
  }

  addReviewForProduct(productId: string) {
    this.addReview.set(productId);
  }

  getSubtotal(order: IOrderDetails): number {
    return order.cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
  }

  protected reviewFrom = new FormGroup({
    rating: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    review: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  setRating(rate: number = 0) {
    const rating = this.reviewFrom.controls.rating;
    rating.setValue(rate);
  }

  createReview(productId: string, rating: number = 0, review: string = '') {
    this.creatingReview.set(true);
    this.createReviewError.set(false);
    this.createReviewErrorMessage.set('');

    this.reviewService
      .createReviewForProduct(productId, review, rating)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.creatingReview.set(false);

          this.reviewDetails.set(res.data);
          const updatedReviews: IReview = {
            ...res.data,
            user: { _id: res.data.user, name: this.authService.currentUser()?.name || '' },
          };
          this.UserReviewForProduct.update((reviews) => [...reviews, updatedReviews]);

          this.reviewFrom.reset({
            rating: 0,
            review: '',
          });

          this.addReview.set(null);
        },

        error: (err: HttpErrorResponse) => {
          this.creatingReview.set(false);
          this.createReviewError.set(true);

          this.createReviewErrorMessage.set(
            err.error?.message || err.message || 'Failed to create review',
          );
        },
      });
  }

  sentReview(productId: string) {
    const { rating, review } = this.reviewFrom.getRawValue();
    if (this.reviewFrom.invalid) {
      this.reviewFrom.markAllAsTouched();
      return;
    }
    if (this.editReview()) {
      this.sendUpdateReview(this.editReview()!, rating, review);
    } else {
      this.createReview(productId, rating, review);
    }
  }

  getUserReviews() {
    const userId = this.authService.currentUser()?.id;

    if (!userId) return;

    this.loadingReview.set(true);
    this.errorReview.set(false);
    this.errMsgReview.set('');

    this.reviewService
      .getUserReviews(userId, this.orderProductsIds())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loadingReview.set(false);
          this.UserReviewForProduct.set(res);
        },

        error: (err: HttpErrorResponse) => {
          this.loadingReview.set(false);
          this.errorReview.set(true);

          this.errMsgReview.set(err.error?.message || err.message || 'Failed to load your reviews');
        },
      });
  }
  checkReviewForEachProduct(productId: string): boolean {
    return this.UserReviewForProduct().some((item) => item.product === productId);
  }

  updateReview(productId: string, userReview: IReview) {
    this.addReview.set(productId);
    this.editReview.set(userReview._id);
    this.reviewFrom.patchValue({
      rating: userReview.rating,
      review: userReview.review,
    });
  }

  sendUpdateReview(reviewId: string, rating: number, review: string) {
    this.updateReviewLoading.set(true);
    this.updateReviewError.set(false);
    this.updateReviewMsgErr.set('');
    this.reviewService
      .updateReview(reviewId, review, rating)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.updateReviewLoading.set(false);
          this.updateReviewError.set(false);
          this.updateReviewMsgErr.set('');
          this.UserReviewForProduct.update((prev) =>
            prev.map((item) => (item._id === reviewId ? res.data : item)),
          );
          this.addReview.set(null);
          this.editReview.set(null);
        },
        error: (err: HttpErrorResponse) => {
          this.updateReviewLoading.set(false);
          this.updateReviewError.set(true);
          this.updateReviewMsgErr.set(
            err.error?.message || err.message || 'Failed to update review',
          );
        },
      });
  }

  deleteReview(id: string) {
    this.deleteErrorMsg.set('');
    const prevReviews = this.UserReviewForProduct();
    this.UserReviewForProduct.update((item) => item.filter((rev) => rev._id !== id));
    this.reviewService
      .deleteReview(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleteErrorMsg.set('');
        },
        error: (err: HttpErrorResponse) => {
          this.UserReviewForProduct.set(prevReviews);
          this.deleteErrorMsg.set(err.error?.message || err.message || 'Failed to delete review');
        },
      });
  }
  async confirmDelete(reviewId: string) {
    const confirmed = await this.sweetAlert.confirmDelete();
    if (confirmed) {
      this.deleteReview(reviewId);
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadOrderId();
  }
}
