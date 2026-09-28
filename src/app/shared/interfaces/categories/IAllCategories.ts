import { ICategory } from './ICategory';

export interface IAllCategories {
  results: number;
  metadata: IMetadata;
  data: ICategory[];
}

interface IMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
}
