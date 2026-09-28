import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ICategory } from '../../../interfaces/categories/ICategory';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../../core/services/categories/categories-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../ui/error/error-ui-component/error-ui-component';
import { CategoriesSidebarSkeleton } from '../../skeleton/categories-sidebar-skeleton/categories-sidebar-skeleton';

@Component({
  selector: 'app-categories-side-bar',
  imports: [ErrorUiComponent, CategoriesSidebarSkeleton],
  templateUrl: './categories-side-bar.html',
  styleUrl: './categories-side-bar.scss',
})
export class CategoriesSideBar implements OnInit {
  protected allCategory = signal<ICategory[]>([]);
  selectedCategories = signal<string[]>([]);
  categoriesDetailsComponent = input<boolean>(false);
  action = output<string[]>();
  allCategoryAction = output<ICategory[]>();
  allChecked = signal<boolean>(false);
  allCategoriesLoading = signal<boolean>(false);
  allCategoriesError = signal<boolean>(false);
  allCategoriesErrMsg = signal<string>('');
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  isAllSelected = computed(() => this.allChecked() || this.selectedCategories().includes(''));

  isSelected(id: string): boolean {
    return this.selectedCategories().includes(id);
  }

  isNotSelected(id: string): boolean {
    return !this.selectedCategories().includes(id);
  }

  filterByCategory(event: Event, categoryId: string): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (categoryId === '') {
      this.selectedCategories.set(checked ? [''] : []);
    } else {
      this.selectedCategories.update((cats) => {
        const filtered = cats.filter((id) => id !== '');

        if (checked) {
          return [...filtered, categoryId];
        }

        return filtered.filter((id) => id !== categoryId);
      });
    }

    const categories = this.selectedCategories();

    this.action.emit(categories);

    if (this.categoriesDetailsComponent()) {
      if (categories.length === 0 || categories.includes('')) {
        this.router.navigate(['/category', 'all']);
      } else {
        this.router.navigate(['/category', categories.join('&')]);
      }
    }
  }

  loadCategories() {
    this.allCategoriesLoading.set(true);
    this.allCategoriesError.set(false);
    this.allCategoriesErrMsg.set('');
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allCategoriesLoading.set(false);
          this.allCategoriesError.set(false);
          this.allCategoriesErrMsg.set('');
          this.allCategory.set(res.data);
          this.allCategoryAction.emit(this.allCategory());
        },
        error: (err: HttpErrorResponse) => {
          this.allCategoriesLoading.set(false);
          this.allCategoriesError.set(true);
          this.allCategoriesErrMsg.set(
            err.error?.message || err.message || 'Failed to load categories',
          );
        },
      });
  }

  clearSelectedCategories(): void {
    this.selectedCategories.set([]);
    if (this.categoriesDetailsComponent()) {
      this.router.navigate(['/category', 'all']);
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.categoriesDetailsComponent()) {
      this.activatedRoute.paramMap.subscribe({
        next: (val) => {
          const ids = val.get('id');
          if (!ids || ids === 'all') {
            this.selectedCategories.set([]);
            this.allChecked.set(true);
            return;
          } else {
            this.selectedCategories.set(ids.split('&'));
            this.allChecked.set(false);
          }
        },
      });
    }
  }
}
