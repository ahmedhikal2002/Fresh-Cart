import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { IBrandResponse, IBrands, IBrandsResponse } from '../../../shared/interfaces/brands/brands';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly http = inject(HttpClient);

  getAllBrands(limit: number = 40): Observable<IBrands[]> {
    return this.http
      .get<IBrandsResponse>(`${environment.baseUrl}/api/v1/brands`, {
        params: {
          limit,
          page: 1,
        },
      })
      .pipe(
        expand((res) => {
          const next = res.metadata.nextPage;
          if (next) {
            return this.http.get<IBrandsResponse>(`${environment.baseUrl}/api/v1/brands`, {
              params: {
                limit,
                page: next,
              },
            });
          }
          return EMPTY;
        }),
        map((res) => res.data),
        reduce((acc, curr) => [...acc, ...curr], [] as IBrands[]),
      );
  }

  getAllBrandsPaginated(currentPage: number, limit: number) {
    return this.http.get<IBrandsResponse>(`${environment.baseUrl}/api/v1/brands`, {
      params: {
        limit,
        page: currentPage,
      },
    });
  }

  getBrandById(brandId: string): Observable<IBrandResponse> {
    return this.http.get<IBrandResponse>(`${environment.baseUrl}/api/v1/brands/${brandId}`);
  }
}
