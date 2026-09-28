export interface IBrandsResponse {
  results: number;
  metadata: Metadata;
  data: IBrands[];
}

export interface IBrands {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBrandResponse {
  data: IBrands;
}

interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}
