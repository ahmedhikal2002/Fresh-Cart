import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import {
  ICreateReviewResponse,
  IReviewResponse,
  IReview,
  IReviewsResponse,
} from '../../../shared/interfaces/reviews/reviews';
import { AllOrdersService } from '../allOrders/all-orders-service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly orderService = inject(AllOrdersService);

  getHomeReviews(limit: number = 20): Observable<IReview[]> {
    return this.http
      .get<IReviewsResponse>(`${environment.baseUrl}/api/v1/reviews`, {
        params: {
          limit,
        },
      })
      .pipe(map((res) => res.data.filter((review) => review.rating >= 4).slice(0, 9)));
  }

  getReviewsForPRoduct(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<IReviewsResponse> {
    return this.http.get<IReviewsResponse>(
      `${environment.baseUrl}/api/v1/products/${productId}/reviews/`,
      {
        params: {
          limit,
          page,
        },
      },
    );
  }

  createReviewForProduct(
    productId: string,
    review: string,
    rating: number,
  ): Observable<ICreateReviewResponse> {
    return this.http.post<ICreateReviewResponse>(
      `${environment.baseUrl}/api/v1/products/${productId}/reviews`,
      {
        review,
        rating,
      },
    );
  }

  getUserReviews(userId: string, productIds: string[]): Observable<IReview[]> {
    const page = 1;
    const limit = 40;
    let baseParams = new HttpParams().set('page', page).set('limit', limit).set('user', userId);
    if (productIds.length > 0) {
      productIds.forEach((id) => (baseParams = baseParams.append('product', id)));
    }

    return this.http
      .get<IReviewsResponse>(`${environment.baseUrl}/api/v1/reviews`, { params: baseParams })
      .pipe(
        expand((res) => {
          const next = res.metadata.nextPage;

          if (!next) {
            return EMPTY;
          }

          return this.http.get<IReviewsResponse>(`${environment.baseUrl}/api/v1/reviews`, {
            params: baseParams.set('page', next),
          });
        }),

        map((res) => res.data),

        reduce(
          (allReviews, currentPageReviews) => [...allReviews, ...currentPageReviews],
          [] as IReview[],
        ),
      );
  }

  getReviewById(reviewId: string): Observable<IReviewResponse> {
    return this.http.get<IReviewResponse>(`${environment.baseUrl}/api/v1/reviews/${reviewId}`);
  }

  updateReview(reviewId: string, review: string, rate: number): Observable<IReviewResponse> {
    return this.http.put<IReviewResponse>(`${environment.baseUrl}/api/v1/reviews/${reviewId}`, {
      review: review,
      rating: rate,
    });
  }

  deleteReview(reviewId: string): Observable<HttpResponse<void>> {
    return this.http.delete<HttpResponse<void>>(
      `${environment.baseUrl}/api/v1/reviews/${reviewId}`,
    );
  }
}
