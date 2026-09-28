import { Component, DestroyRef, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories-service';
import { Subscription } from 'rxjs';
import { ICategory } from '../../shared/interfaces/categories/ICategory';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../shared/components/logic/pagination-component/pagination-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AllCategoriesSkeleton } from '../../shared/components/skeleton/all-categories-skeleton/all-categories-skeleton';

@Component({
  selector: 'app-categories',
  imports: [ErrorUiComponent, RouterLink, AllCategoriesSkeleton, PaginationComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  allCategory = signal<ICategory[]>([]);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal<string>('');
  pageNumber = signal<number>(1);
  numberOfPages = signal<number>(1);
  readonly limit = 6;

  constructor(
    private categoriesService: CategoriesService,
    private destroyRef: DestroyRef,
  ) {}

  loadCategories(pageNumber: number = 1) {
    this.loading.set(true);
    this.error.set(false);
    this.categoriesService
      .getAllCategoriesPaginated(pageNumber, this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.allCategory.set(res.data);
          this.pageNumber.set(res.metadata.currentPage);
          this.numberOfPages.set(res.metadata.numberOfPages);
        },
        error: (err: HttpErrorResponse) => {
          this.allCategory.set([]);

          this.loading.set(false);
          this.error.set(true);

          this.errorMessage.set(err.error?.message || err.message || 'Failed to load categories');
        },
      });
  }

  goToPage(pageNumber: number): void {
    this.loadCategories(pageNumber);
  }

  ngOnInit(): void {
    this.loadCategories();
  }
}
