import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products/products-service';
import { IProduct } from '../../../interfaces/products/IProduct';
import { ProductsSkeleton } from '../../skeleton/products-skeleton/products-skeleton';
import { ErrorUiComponent } from '../../ui/error/error-ui-component/error-ui-component';
import { HttpErrorResponse } from '@angular/common/http';
import { CardProduct } from '../card-product/card-product';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-products',
  imports: [CardProduct, ProductsSkeleton, ErrorUiComponent],
  templateUrl: './home-products.html',
  styleUrl: './home-products.scss',
})
export class HomeProducts implements OnInit {
  allProducts = signal<IProduct[]>([]);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal('');

  constructor(
    private productsService: ProductsService,
    private destroyRef: DestroyRef,
  ) {}

  loadHomeProduct() {
    this.loading.set(true);
    this.error.set(false);
    this.productsService
      .getHomeProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.allProducts.set(res);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          const message = err.error?.message || err.message || 'Failed to load products';
          this.errorMessage.set(message);
          this.allProducts.set([]);
        },
      });
  }

  ngOnInit(): void {
    this.loadHomeProduct();
  }
}
