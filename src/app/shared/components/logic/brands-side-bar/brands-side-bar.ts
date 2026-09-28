import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { IBrands } from '../../../interfaces/brands/brands';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../../../../core/services/brands/brands-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUiComponent } from '../../ui/error/error-ui-component/error-ui-component';
import { BrandsSidebarSkeleton } from '../../skeleton/brands-sidebar-skeleton/brands-sidebar-skeleton';

@Component({
  selector: 'app-brands-side-bar',
  imports: [BrandsSidebarSkeleton, ErrorUiComponent],
  templateUrl: './brands-side-bar.html',
  styleUrl: './brands-side-bar.scss',
})
export class BrandsSideBar {
  allBrands = signal<IBrands[]>([]);
  selectedBrand = signal<string>('');
  searchBrand = signal<string>('');
  action = output<string>();
  brandsDetailsComponent = input<boolean>(false);
  activatedRoute = inject(ActivatedRoute);
  allBrandsLoading = signal<boolean>(false);
  allBrandsError = signal<boolean>(false);
  allBrandsErrMsg = signal<string>('');
  private readonly brandsService = inject(BrandsService);
  private readonly destroyRef = inject(DestroyRef);
  filteredBrands = computed(() => {
    const search = this.searchBrand().trim().toLowerCase();

    if (!search) {
      return this.allBrands();
    }
    return this.allBrands().filter((brand) => brand.name.toLowerCase().includes(search));
  });

  isAllSelected = computed(() => this.selectedBrand() === '');

  isSelected(id: string): boolean {
    return this.selectedBrand() === id;
  }

  isNotSelected(id: string): boolean {
    return this.selectedBrand() !== id;
  }

  hasSelectedBrand = computed(() => this.selectedBrand() !== '');

  loadAllBrands() {
    this.allBrandsLoading.set(true);
    this.allBrandsError.set(false);
    this.allBrandsErrMsg.set('');
    this.brandsService
      .getAllBrands()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.allBrandsLoading.set(false);
          this.allBrandsError.set(false);
          this.allBrandsErrMsg.set('');
          this.allBrands.set(res);
        },
        error: (err: HttpErrorResponse) => {
          this.allBrandsLoading.set(false);
          this.allBrandsError.set(true);
          this.allBrandsErrMsg.set(err.error?.message || err.message || 'Failed to load brands');
        },
      });
  }

  searchBrands(event: Event) {
    const search = (event.target as HTMLInputElement).value;
    this.searchBrand.set(search);
  }
  filterByBrand(event: Event, brandId: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedBrand.set(brandId);
    } else {
      this.selectedBrand.set('');
    }
    this.action.emit(brandId);
  }

  clearBrands() {
    this.selectedBrand.set('');
  }

  ngOnInit(): void {
    this.loadAllBrands();

    if (this.brandsDetailsComponent()) {
      this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (val) => {
          const id = val.get('id');
          id && this.selectedBrand.set(id);
        },
      });
    }
  }
}
