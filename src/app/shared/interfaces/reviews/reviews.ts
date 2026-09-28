export interface IReviewsResponse {
  results: number;
  metadata: Metadata;
  data: IReview[];
}

export interface IReview {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewResponse {
  data: IReview;
}

interface User {
  _id: string;
  name: string;
}

interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}

export interface ICreateReviewResponse {
  data: ICreateReview;
}

export interface ICreateReview {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
