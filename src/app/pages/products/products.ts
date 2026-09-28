import {
  Component,
  inject,
  signal,
  computed,
  viewChild,
  ViewChild,
  ElementRef,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { ProductsService } from '../../core/services/products/products-service';
import { Subscription } from 'rxjs';
import { IProductParams } from '../../shared/interfaces/products/IProductParams';
import { IProduct } from '../../shared/interfaces/products/IProduct';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { ICategory } from '../../shared/interfaces/categories/ICategory';
import { CategoriesService } from '../../core/services/categories/categories-service';
import { BrandsService } from '../../core/services/brands/brands-service';
import { IBrands } from '../../shared/interfaces/brands/brands';
import { CardProduct } from '../../shared/components/logic/card-product/card-product';
import { PaginationComponent } from '../../shared/components/logic/pagination-component/pagination-component';
import { EmptyStateComponent } from '../../shared/components/ui/empty-state-component/empty-state-component';
import { BrandsSideBar } from '../../shared/components/logic/brands-side-bar/brands-side-bar';
import { CategoriesSideBar } from '../../shared/components/logic/categories-side-bar/categories-side-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsSkeleton } from '../../shared/components/skeleton/products-skeleton/products-skeleton';
import { AllProductsSkeleton } from '../../shared/components/skeleton/all-products-skeleton/all-products-skeleton';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  imports: [
    ErrorUiComponent,
    CardProduct,
    EmptyStateComponent,
    PaginationComponent,
    BrandsSideBar,
    CategoriesSideBar,
    AllProductsSkeleton,
  ],
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  protected allProducts = signal<IProduct[]>([]);
  private readonly productsService = inject(ProductsService);
  private readonly categoriesSideBar = viewChild<CategoriesSideBar>(CategoriesSideBar);
  private readonly brandsSideBar = viewChild<BrandsSideBar>(BrandsSideBar);
  private readonly destroyRef = inject(DestroyRef);
  allProductsLoading = signal<boolean>(false);
  allProductsError = signal<boolean>(false);
  allProductsErrorMessage = signal<string>('');

  numberOfPages = signal<number>(1);
  maxPrice = signal<number | null>(null);
  minPrice = signal<number | null>(null);
  keyword = signal<string>('');
  filters = signal<IProductParams>({
    page: 1,
    limit: 10,
  });

  loadAllProducts(filter: IProductParams = { limit: 10, page: 1 }) {
    this.allProductsLoading.set(true);
    this.allProductsError.set(false);
    this.allProductsErrorMessage.set('');
    this.productsService
      .getAllProductsPaginated(filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (val) => {
          this.allProductsLoading.set(false);
          this.allProductsError.set(false);
          this.allProductsErrorMessage.set('');
          this.allProducts.set(val.data);
          this.filters.update((prev) => ({ ...prev, page: val.metadata.currentPage }));
          this.numberOfPages.set(val.metadata.numberOfPages);
        },
        error: (err: HttpErrorResponse) => {
          this.allProductsLoading.set(false);
          this.allProductsError.set(true);
          this.allProductsErrorMessage.set(
            err.error?.message || err.message || 'Failed to load categories',
          );

          this.allProducts.set([]);
        },
      });
  }

  filterByBrand(brandId: string): void {
    this.filters.update((prev) => ({ ...prev, page: 1, brand: brandId ? brandId : undefined }));

    this.loadAllProducts(this.filters());
  }
  filterByPrice(type: 'min' | 'max', value: string) {
    const val = value ? Number(value) : null;
    if (type === 'min') {
      this.minPrice.set(val);
    } else {
      this.maxPrice.set(val);
    }
    this.filters.update((prev) => ({
      ...prev,
      page: 1,
      'price[gte]': this.minPrice() ?? undefined,
      'price[lte]': this.maxPrice() ?? undefined,
    }));
    this.loadAllProducts(this.filters());
  }

  goToPage(page: number) {
    this.filters.update((prev) => ({ ...prev, page: page }));
    this.loadAllProducts(this.filters());
  }

  sortBy(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value;

    this.filters.update((prev) => ({
      ...prev,
      page: 1,
      sort: sort || undefined,
    }));

    this.loadAllProducts(this.filters());
  }

  filterByCategory(categoryIds: string[]): void {
    this.filters.update((prev) => ({
      ...prev,
      page: 1,
      'category[in]': categoryIds.length > 0 ? categoryIds : undefined,
    }));

    this.loadAllProducts(this.filters());
  }
  filterBySearch(event: Event) {
    const search = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (search) {
      this.keyword.set(search);
    }
    this.filters.update((prev) => ({ ...prev, page: 1, keyword: this.keyword() }));
    this.loadAllProducts(this.filters());
  }
  clearAllFilters() {
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.keyword.set('');
    this.categoriesSideBar()?.clearSelectedCategories();
    this.brandsSideBar()?.clearBrands();
    this.filters.set({
      page: 1,
      limit: 10,
    });

    this.loadAllProducts(this.filters());
  }

  hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(
      f.keyword ||
      f.brand ||
      f.sort ||
      f['price[gte]'] !== undefined ||
      f['price[lte]'] !== undefined ||
      (f['category[in]'] && f['category[in]']!.length > 0)
    );
  });
  ngOnInit(): void {
    this.loadAllProducts(this.filters());
  }
}
