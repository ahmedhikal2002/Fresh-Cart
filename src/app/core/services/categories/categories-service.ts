import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ICategory, ICategoryResponse } from '../../../shared/interfaces/categories/ICategory';
import { IAllCategories } from '../../../shared/interfaces/categories/IAllCategories';
import { ISubCategoryResponse } from '../../../shared/interfaces/categories/ISubCategory';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);

  getAllCategories(): Observable<IAllCategories> {
    return this.http.get<IAllCategories>(`${environment.baseUrl}/api/v1/categories`);
  }

  getAllCategoriesPaginated(currentPage: number, limit: number): Observable<IAllCategories> {
    return this.http.get<IAllCategories>(`${environment.baseUrl}/api/v1/categories`, {
      params: {
        page: currentPage,
        limit,
      },
    });
  }

  getCategoryById(id: string): Observable<ICategoryResponse> {
    return this.http.get<ICategoryResponse>(`${environment.baseUrl}/api/v1/categories/${id}`);
  }
  getAllSubCategoriesOnCategory(catId: string, limit = 40): Observable<ISubCategoryResponse> {
    return this.http.get<ISubCategoryResponse>(
      `${environment.baseUrl}/api/v1/categories/${catId}/subcategories`,
      {
        params: {
          category: catId,
          limit,
        },
      },
    );
  }
}
