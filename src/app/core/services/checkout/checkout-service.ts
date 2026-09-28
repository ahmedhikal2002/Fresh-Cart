import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {
  ICashOrderResponse,
  IOnlineOrderResponse,
  IShippingAddressCash,
  IShippingAddressOnline,
} from '../../../shared/interfaces/checkout/checkout';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  CreateCashOrderFromCart(
    cartId: string,
    shippingAddress: IShippingAddressCash,
  ): Observable<ICashOrderResponse> {
    return this.http.post<ICashOrderResponse>(`${environment.baseUrl}/api/v2/orders/${cartId}`, {
      shippingAddress: shippingAddress,
    });
  }

  CreateOnlinePayment(
    cartId: string,
    shippingAddress: IShippingAddressOnline,
  ): Observable<IOnlineOrderResponse> {
    const baseUrl = isPlatformBrowser(this.platformId)
      ? window.location.origin
      : environment.baseUrl;
    return this.http.post<IOnlineOrderResponse>(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${baseUrl}`,
      {
        shippingAddress: shippingAddress,
      },
    );
  }
}
