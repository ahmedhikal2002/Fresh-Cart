import { IProduct } from './IProduct';

export interface IAllProducts {
  results: number;
  metadata: Metadata;
  data: IProduct[];
}

interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}
