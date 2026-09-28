import { ICategory } from '../categories/ICategory';

export interface IAddToCartResponse {
  status?: string;
  message?: string;
  numOfCartItems: number;
  cartId: string;
  data: ICart;
}

export interface ICart {
  cartId: string;
  cartOwner: string;
  products: ICartProduct[];
  createdAt?: string;
  updatedAt?: string;
  totalCartPrice: number;
}

export interface ICartProduct {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

export interface Product {
  subcategory: Subcategory[];
  _id: string;
  title: string;
  slug: string;
  quantity: number;
  imageCover: string;
  category: IBrandAndICategory;
  brand: IBrandAndICategory;
  ratingsAverage: number;
  id: string;
}

interface IBrandAndICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface ICartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: ICart;
}
