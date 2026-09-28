import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { filter, map, Observable } from 'rxjs';
import { IAllProducts } from '../../../shared/interfaces/products/IAllPRoducts';

import { GetByIdResponse } from '../../../shared/interfaces/products/GetByIdResponse';
import { IProductParams } from '../../../shared/interfaces/products/IProductParams';
import { IProduct } from '../../../shared/interfaces/products/IProduct';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  getHomeProducts(): Observable<IProduct[]> {
    return this.http
      .get<IAllProducts>(`${environment.baseUrl}/api/v1/products`)
      .pipe(map((res) => res.data.slice(0, 12)));
  }

  getAllProductsPaginated(params: IProductParams): Observable<IAllProducts> {
    let httpParams = new HttpParams();

    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit);
    }
    if (params.brand) {
      httpParams = httpParams.set('brand', params.brand);
    }
    if (params.keyword) {
      httpParams = httpParams.set('keyword', params.keyword);
    }
    if (params.fields) {
      httpParams = httpParams.set('fields', params.fields);
    }
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params['price[gte]'] !== undefined) {
      httpParams = httpParams.set('price[gte]', params['price[gte]']);
    }
    if (params['price[lte]'] !== undefined) {
      httpParams = httpParams.set('price[lte]', params['price[lte]']);
    }

    if (params['category[in]']) {
      params['category[in]']?.forEach(
        (cat) => (httpParams = httpParams.append('category[in]', cat)),
      );
    }

    return this.http.get<IAllProducts>(`${environment.baseUrl}/api/v1/products`, {
      params: httpParams,
    });
  }

  getProductById(id: string): Observable<GetByIdResponse> {
    return this.http.get<GetByIdResponse>(`${environment.baseUrl}/api/v1/products/${id}`);
  }
}
