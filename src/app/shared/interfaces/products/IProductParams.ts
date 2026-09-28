export interface IProductParams {
  limit?: number;
  sort?: string;
  fields?: string;
  page?: number;
  keyword?: string;

  'price[gte]'?: number;
  'price[lte]'?: number;

  brand?: string;

  'category[in]'?: string[];
}
