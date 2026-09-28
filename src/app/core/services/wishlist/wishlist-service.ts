import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { IProduct } from '../../../shared/interfaces/products/IProduct';
import { AuthService } from '../auth/auth-service';
import { ToastService } from '../Toast/toast-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  wishList = signal<IWishList[]>([]);
  addToWishlistDisabled = signal<string | null>(null);
  toastr = inject(ToastService);
  router = inject(Router);

  addToWishlistOptimistic(product: IProduct) {
    let updatedWishList = this.wishList();
    updatedWishList = [...updatedWishList, product];
    this.wishList.set(updatedWishList);
  }

  removeFromWishlistOptimistic(productId: string) {
    let updatedWishList = this.wishList();
    this.wishList.set(updatedWishList.filter((product) => product._id !== productId));
  }

  totalWishlistItemsOptimistic = computed(() => this.wishList().length);

  addProductToWishlist(productId: string): Observable<IWishlistResponse> {
    return this.http.post<IWishlistResponse>(`${environment.baseUrl}/api/v1/wishlist`, {
      productId,
    });
  }

  getLoggedUserWishlist(): Observable<IGetWishlistResponse> {
    return this.http.get<IGetWishlistResponse>(`${environment.baseUrl}/api/v1/wishlist`);
  }

  removeProductFromWishlist(productId: string): Observable<IWishlistResponse> {
    return this.http.delete<IWishlistResponse>(
      `${environment.baseUrl}/api/v1/wishlist/${productId}`,
    );
  }

  addToWishList(product: IProduct) {
    const prevWishList = this.wishList();
    this.addToWishlistOptimistic(product);
    this.addToWishlistDisabled.set(product._id);
    this.addProductToWishlist(product._id).subscribe({
      next: (res) => {
        this.addToWishlistDisabled.set(null);
        res.status === 'success' && this.toastr.toastSuccess(res.message);
        const undatedWishlist = this.wishList().filter((item) => res.data.includes(item._id));
        this.wishList.set(undatedWishlist);
      },
      error: (err: HttpErrorResponse) => {
        this.addToWishlistDisabled.set(null);
        this.toastr.ToastError(err.error?.message || err.message || 'Failed to add product');
        this.wishList.set(prevWishList);
      },
    });
  }
  removeFromWishlist(productId: string) {
    const prevWishList = this.wishList();
    this.removeFromWishlistOptimistic(productId);
    this.addToWishlistDisabled.set(productId);
    this.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        this.addToWishlistDisabled.set(null);
        res.status === 'success' && this.toastr.toastSuccess(res.message);
        const updatedWishlist = this.wishList().filter((item) => res.data.includes(item._id));

        this.wishList.set(updatedWishlist);
      },
      error: (err: HttpErrorResponse) => {
        this.addToWishlistDisabled.set(null);
        this.toastr.ToastError(err.error?.message || err.message || 'Failed to remove product');
        this.wishList.set(prevWishList);
      },
    });
  }

  wishListToggle(product: IProduct) {
    if (this.authService.currentUser()) {
      !this.isInWishlist(product._id)
        ? this.addToWishList(product)
        : this.removeFromWishlist(product._id);
    } else {
      this.toastr.toastWarning('please login first to complete this action');
      this.router.navigateByUrl('/login');
    }
  }
  isInWishlist(productId: string): boolean {
    return this.wishList().some((item) => item._id === productId);
  }
}
