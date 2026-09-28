import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BrandsService } from '../../../../core/services/brands/brands-service';
import { IBrands } from '../../../interfaces/brands/brands';
import { HttpErrorResponse } from '@angular/common/http';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ErrorUiComponent } from '../../ui/error/error-ui-component/error-ui-component';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HomeBrandsSkeleton } from '../../skeleton/home-brands-skeleton/home-brands-skeleton';

@Component({
  selector: 'app-home-bardes',
  imports: [ErrorUiComponent, RouterLink, HomeBrandsSkeleton, CarouselModule],
  templateUrl: './home-brands.html',
  styleUrl: './home-brands.scss',
})
export class HomeBardes implements OnInit {
  private readonly brandsService = inject(BrandsService);
  protected allBrands = signal<IBrands[]>([]);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal<string>('');
  private readonly destroyRef = inject(DestroyRef);
  readonly limit = 40;

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

  loadBrands() {
    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');
    this.brandsService
      .getAllBrands(this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.error.set(false);
          this.errorMessage.set('');
          this.allBrands.set(res);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errorMessage.set(err.error?.message || err.message || 'Failed to load Brands');
          this.allBrands.set([]);
        },
      });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadBrands();
  }
}
