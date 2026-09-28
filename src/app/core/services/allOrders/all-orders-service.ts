import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import {
  IAllOrdersResponse,
  IOrderDetailsResponse,
} from '../../../shared/interfaces/all-orders/allOrders';

@Injectable({
  providedIn: 'root',
})
export class AllOrdersService {
  private readonly http = inject(HttpClient);

  getUserOrders(userId: string): Observable<IAllOrdersResponse[]> {
    return this.http.get<IAllOrdersResponse[]>(
      `${environment.baseUrl}/api/v1/orders/user/${userId}`,
    );
  }

  getOrderDetails(orderId: string): Observable<IOrderDetailsResponse> {
    return this.http.get<IOrderDetailsResponse>(`${environment.baseUrl}/api/v1/orders/${orderId}`);
  }
}
