import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ReviewService } from '../../../../core/services/reviews/review-service';
import { IReview } from '../../../interfaces/reviews/reviews';
import { Subscription } from 'rxjs';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../ui/error/error-ui-component/error-ui-component';
import { ReviewCard } from '../review-card/review-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HomeReviewsSkeleton } from '../../skeleton/home-reviews-skeleton/home-reviews-skeleton';

@Component({
  selector: 'app-home-reviews',
  imports: [CarouselModule, ErrorUiComponent, HomeReviewsSkeleton, ReviewCard],
  templateUrl: './home-reviews.html',
  styleUrl: './home-reviews.scss',
})
export class HomeReviews implements OnInit {
  private readonly reviewService = inject(ReviewService);
  protected homeReviews = signal<IReview[]>([]);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal<string>('');
  subscription: Subscription = new Subscription();
  readonly limit = 20;
  private readonly destroyRef = inject(DestroyRef);
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    dotsEach: true,
    autoplay: true,
    autoplayTimeout: 5000,
    slideBy: 3,
    autoplayHoverPause: true,
    autoplaySpeed: 800,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-chevron-left"></i>',
      '<i class="fa-solid fa-chevron-right"></i>',
    ],
    nav: true,
    margin: 0,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1024: { items: 3 },
    },
  };

  loadReviews() {
    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');
    this.subscription = this.reviewService
      .getHomeReviews(this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.errorMessage.set('');
          this.homeReviews.set(res);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errorMessage.set(err.error?.message || err.message || 'Failed to load Brands');
          this.homeReviews.set([]);
        },
      });
  }
  ngOnInit(): void {
    this.loadReviews();
  }
}
