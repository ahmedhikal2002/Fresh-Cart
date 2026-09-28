import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories-service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategory } from '../../../interfaces/categories/ICategory';
import { Subscription } from 'rxjs';
import { CategoriesSkeleton } from '../../skeleton/categories-skeleton/categories-skeleton';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../ui/error/error-ui-component/error-ui-component';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-all-categories',
  imports: [CarouselModule, CategoriesSkeleton, ErrorUiComponent, RouterLink],
  templateUrl: './all-categories.html',
  styleUrl: './all-categories.scss',
})
export class AllCategories implements OnInit {
  allCategory = signal<ICategory[]>([]);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal<string>('');
  subscription: Subscription = new Subscription();

  constructor(
    private categoriesService: CategoriesService,
    private destroyRef: DestroyRef,
  ) {}
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    autoplaySpeed: 1000,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      1100: {
        items: 5,
      },
      1400: {
        items: 6,
      },
    },
    nav: false,
  };
  loadCategories() {
    this.loading.set(true);
    this.error.set(false);
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (val) => {
          this.loading.set(false);
          this.error.set(false);
          this.allCategory.set(val.data);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errorMessage.set(err.error?.message || err.message || 'Failed to load categories');
          this.allCategory.set([]);
        },
      });
  }

  ngOnInit(): void {
    this.loadCategories();
  }
}
