import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service';
import { AllOrdersService } from '../../core/services/allOrders/all-orders-service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ErrorUiComponent } from '../../shared/components/ui/error/error-ui-component/error-ui-component';
import { AllOrdersSkeleton } from '../../shared/components/skeleton/all-orders-skeleton/all-orders-skeleton/all-orders-skeleton';
import { IAllOrdersResponse } from '../../shared/interfaces/all-orders/allOrders';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../shared/components/ui/empty-state-component/empty-state-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-all-orders',
  imports: [
    DatePipe,
    CurrencyPipe,
    ErrorUiComponent,
    AllOrdersSkeleton,
    RouterLink,
    EmptyStateComponent,
  ],
  templateUrl: './all-orders.html',
  styleUrl: './all-orders.scss',
})
export class AllOrders {
  private readonly authService = inject(AuthService);
  private readonly allOrdersService = inject(AllOrdersService);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);
  error = signal(false);
  errMsg = signal('');
  userId = signal('');
  protected orders = signal<IAllOrdersResponse[]>([]);
  loadUserOrders(userId: string) {
    this.loading.set(true);
    this.errMsg.set('');
    this.error.set(false);
    this.allOrdersService
      .getUserOrders(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.errMsg.set('');
          this.error.set(false);
          const sortedOrders = [...res].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          this.orders.set(sortedOrders);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(true);
          this.errMsg.set(err.error.message || err.message || 'someThing Went Wrong');
        },
      });
  }
  getItemsPreview(order: IAllOrdersResponse): string {
    const titles = order.cartItems.map((item) => item.product.title);
    if (titles.length === 1) return titles[0];
    if (titles.length === 2) return titles.join(', ');
    return `${titles[0]}, ${titles[1]} +${titles.length - 2} more`;
  }
  ngOnInit(): void {
    const id = this.authService.currentUser()?.id;
    if (id) {
      this.userId.set(id);
      this.loadUserOrders(id);
    }
  }
}
