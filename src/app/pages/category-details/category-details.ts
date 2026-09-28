import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories-service';
import { ICategory } from '../../shared/interfaces/categories/ICategory';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { IProductParams } from '../../shared/interfaces/products/IProductParams';
import { ProductsService } from '../../core/services/products/products-service';
import { IProduct } from '../../shared/interfaces/products/IProduct';
import { CardProduct } from '../../shared/components/logic/card-product/card-product';
import { PaginationComponent } from '../../shared/components/logic/pagination-component/pagination-component';
import { EmptyStateComponent } from '../../shared/components/ui/empty-state-component/empty-state-component';
import { CategoriesSideBar } from '../../shared/components/logic/categories-side-bar/categories-side-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsSkeleton } from '../../shared/components/skeleton/products-skeleton/products-skeleton';
import { AllProductsSkeleton } from '../../shared/components/skeleton/all-products-skeleton/all-products-skeleton';

@Component({
  selector: 'app-category-details',
  imports: [
    ErrorUiComponent,
    CardProduct,
    PaginationComponent,
    EmptyStateComponent,
    CategoriesSideBar,

    AllProductsSkeleton,
  ],
  templateUrl: './category-details.html',
  styleUrl: './category-details.scss',
})
export class CategoryDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  protected categoryDetails = signal<ICategory>({} as ICategory);
  protected allCategories = signal<ICategory[]>([]);
  protected allProducts = signal<IProduct[]>([]);
  private destroyRef = inject(DestroyRef);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  errMsg = signal<string>('');
  numberOfPages = signal<number>(1);
  productParams = signal<IProductParams>({ limit: 9, page: 1 });
  productLoading = signal<boolean>(false);
  productErr = signal<boolean>(false);
  productErrMsg = signal<string>('');

  categoriesName = signal<string[]>([]);

  loadCategoryId() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        const categoryParam = params.get('id');

        if (!categoryParam || categoryParam === 'all') {
          this.categoryDetails.set({ name: 'All Products' } as ICategory);

          this.productParams.update((prev) => ({
            ...prev,
            'category[in]': undefined,
            page: 1,
          }));

          this.categoriesName.set([]);
          this.loadAllProduct(this.productParams());
          return;
        }

        const categoryIds = categoryParam.split('&');

        const selectedCategories = this.allCategories().filter((category) =>
          categoryIds.includes(category._id),
        );

        this.categoriesName.set(selectedCategories.map((category) => category.name));

        this.productParams.update((prev) => ({
          ...prev,
          'category[in]': categoryIds,
          page: 1,
        }));

        this.loadAllProduct(this.productParams());
      },
    });
  }

  loadCategoryDetails(id: string) {
    this.error.set(false);
    this.errMsg.set('');
    this.categoriesService
      .getCategoryById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.errMsg.set('');
          this.categoryDetails.set(res.data);
          this.productParams.update((prev) => ({
            ...prev,
            'category[in]': [res.data._id],
            page: 1,
          }));

          this.loadAllProduct(this.productParams());
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errMsg.set(err.error?.message || err.message || 'Failed to load Category details');
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

  setAllCategories(allCats: ICategory[]) {
    this.allCategories.set(allCats);

    const categoryParam = this.route.snapshot.paramMap.get('id');

    if (!categoryParam || categoryParam === 'all') {
      this.categoriesName.set([]);
      return;
    }

    const categoryIds = categoryParam.split('&');

    this.categoriesName.set(
      allCats
        .filter((category) => categoryIds.includes(category._id))
        .map((category) => category.name),
    );
  }

  categoryFilter(catId: string[]) {
    let allProductCheck = catId.includes('');

    const selectedCategories = allProductCheck ? [] : catId;

    this.categoriesName.set(
      this.allCategories()
        .filter((cat) => selectedCategories.includes(cat._id))
        .map((cat) => cat.name),
    );

    this.productParams.update((prev) => ({
      ...prev,
      'category[in]':
        allProductCheck || selectedCategories.length === 0 ? undefined : selectedCategories,
      page: 1,
    }));
    this.loadAllProduct(this.productParams());
  }

  ngOnInit(): void {
    this.loadCategoryId();
  }
}
