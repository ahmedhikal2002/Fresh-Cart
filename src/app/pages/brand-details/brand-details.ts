import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products-service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands-service';
import { IBrands } from '../../shared/interfaces/brands/brands';
import { IProduct } from '../../shared/interfaces/products/IProduct';
import { IProductParams } from '../../shared/interfaces/products/IProductParams';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { PaginationComponent } from '../../shared/components/logic/pagination-component/pagination-component';
import { CardProduct } from '../../shared/components/logic/card-product/card-product';
import { EmptyStateComponent } from '../../shared/components/ui/empty-state-component/empty-state-component';
import { BrandsSideBar } from '../../shared/components/logic/brands-side-bar/brands-side-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AllProductsSkeleton } from '../../shared/components/skeleton/all-products-skeleton/all-products-skeleton';
import { BrandsSidebarSkeleton } from '../../shared/components/skeleton/brands-sidebar-skeleton/brands-sidebar-skeleton';

@Component({
  selector: 'app-brand-details',
  imports: [
    ErrorUiComponent,
    PaginationComponent,
    CardProduct,
    EmptyStateComponent,
    BrandsSideBar,
    AllProductsSkeleton,
    BrandsSidebarSkeleton,
  ],
  templateUrl: './brand-details.html',
  styleUrl: './brand-details.scss',
})
export class BrandDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly brandService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);
  protected BrandDetails = signal<IBrands>({} as IBrands);
  protected allBrands = signal<IBrands[]>([]);
  protected allProducts = signal<IProduct[]>([]);
  BrandDetailsLoading = signal<boolean>(false);
  BrandDetailsError = signal<boolean>(false);
  BrandDetailsErrMsg = signal<string>('');
  numberOfPages = signal<number>(1);
  productParams = signal<IProductParams>({ limit: 9, page: 1 });
  productLoading = signal<boolean>(false);
  productErr = signal<boolean>(false);
  productErrMsg = signal<string>('');
  allBrandsLoading = signal<boolean>(false);
  allBrandsErr = signal<boolean>(false);
  allBrandsErrMsg = signal<string>('');
  private destroyRef = inject(DestroyRef);

  loadBrandId() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (val) => {
        let brandId = val.get('id');
        if (brandId && brandId !== 'all') {
          this.loadBrandDetails(brandId);
        } else {
          this.BrandDetails.set({ name: 'All Brands' } as IBrands);
          this.productParams.update((prev) => ({
            ...prev,
            'category[in]': undefined,
          }));
          this.loadAllProduct(this.productParams());
        }
      },
    });
  }

  loadBrandDetails(id: string) {
    this.BrandDetailsError.set(false);
    this.BrandDetailsErrMsg.set('');
    this.brandService
      .getBrandById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.BrandDetailsLoading.set(false);
          this.BrandDetailsError.set(false);
          this.BrandDetailsErrMsg.set('');
          this.BrandDetails.set(res.data);
          this.productParams.update((prev) => ({
            ...prev,
            brand: res.data._id,
            page: 1,
          }));

          this.loadAllProduct(this.productParams());
        },
        error: (err: HttpErrorResponse) => {
          this.BrandDetailsLoading.set(false);
          this.BrandDetailsError.set(true);
          this.BrandDetailsErrMsg.set(
            err.error?.message || err.message || 'Failed to load Category details',
          );
        },
      });
  }

  loadAllBrands() {
    this.allBrandsLoading.set(true);
    this.allBrandsErr.set(false);
    this.allBrandsErrMsg.set('');
    this.brandService
      .getAllBrands()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allBrandsLoading.set(false);
          this.allBrandsErr.set(false);
          this.allBrandsErrMsg.set('');
          this.allBrands.set(res);
        },
        error: (err: HttpErrorResponse) => {
          this.allBrandsLoading.set(false);
          this.allBrandsErr.set(true);
          this.allBrandsErrMsg.set(
            err.error?.message || err.message || 'Failed to load all categories',
          );
        },
      });
  }
  loadAllProduct(
    params: IProductParams = { page: this.productParams().page, limit: this.productParams().limit },
  ) {
    this.productLoading.set(true);
    this.productErr.set(false);
    this.productErrMsg.set('');
    this.productsService
      .getAllProductsPaginated(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.productLoading.set(false);
          this.productErr.set(false);
          this.productErrMsg.set('');
          this.numberOfPages.set(res.metadata.numberOfPages);
          this.allProducts.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.productLoading.set(false);
          this.productErr.set(true);
          this.productErrMsg.set(err.error?.message || err.message || 'Failed to load products');
        },
      });
  }

  changePage(page: number) {
    this.productParams.update((prev) => ({ ...prev, page: page }));
    this.loadAllProduct(this.productParams());
  }

  brandFilter(brandId: string) {
    this.productParams.update((prev) => ({
      ...prev,
      brand: brandId ? brandId : undefined,
      page: 1,
    }));
    this.loadAllProduct(this.productParams());
  }

  ngOnInit(): void {
    this.loadBrandId();
    this.loadAllBrands();
    this.loadAllProduct(this.productParams());
  }
}
