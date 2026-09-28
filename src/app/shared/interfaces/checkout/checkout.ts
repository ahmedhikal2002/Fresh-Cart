export interface IShippingAddressCash {
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}

export type IShippingAddressOnline = Omit<IShippingAddressCash, 'postalCode'>;

export interface IOnlineOrderResponse {
  status: string;
  session: Session;
}

interface Session {
  url: string;
  success_url: string;
  cancel_url: string;
}

export interface ICashOrderResponse {
  status: string;
  message: string;
  user: User;
  pricing: Pricing;
  data: Data;
}

interface Data {
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: User2;
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
}

interface CartItem {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

interface Product {
  subcategory: Subcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  imageCover: string;
  category: Category;
  brand: Category;
  ratingsAverage: number;
  id: string;
}

interface Category {
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

interface User2 {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Pricing {
  cartPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}
