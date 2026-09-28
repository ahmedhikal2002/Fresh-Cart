import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  IAddToCartResponse,
  ICart,
  ICartProduct,
  ICartResponse,
  Product,
} from '../../../shared/interfaces/cart/IAddToCartResponse';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  // private readonly router = inject(Router);

  cart = signal<ICart>({ cartId: '', cartOwner: '', products: [], totalCartPrice: 0 });

  addToCartOptimistic(product: Product, price: number, quantity: number = 1) {
    const currentCart = this.cart();
    let productFound = currentCart.products.find((item) => item.product._id === product._id);
    if (productFound) {
      let updateProduct = currentCart.products.map((item) =>
        item.product._id === product._id ? { ...item, count: item.count + quantity } : item,
      );
      this.cart.set({ ...currentCart, products: updateProduct });
    } else {
      let newProduct: ICartProduct = { _id: product._id, count: quantity, price, product: product };
      this.cart.set({ ...currentCart, products: [...currentCart.products, newProduct] });
    }
  }
  deleteFromCartOptimistic(id: string) {
    let currentCart = this.cart();
    const updated = currentCart.products.filter((p) => p.product._id !== id);
    this.cart.set({ ...currentCart, products: updated });
  }
  increaseProductQuantityOptimistic(id: string) {
    const currentCart = this.cart();
    let updatedProducts = currentCart.products.map((product) =>
      product.product._id === id && product.count < product.product.quantity
        ? { ...product, count: product.count + 1 }
        : product,
    );
    this.cart.set({ ...currentCart, products: updatedProducts });
  }

  decreaseProductQuantityOptimistic(id: string) {
    const currentCart = this.cart();
    let updatedProducts = currentCart.products.map((product) =>
      product.product._id === id && product.count > 1
        ? { ...product, count: product.count - 1 }
        : product,
    );
    this.cart.set({ ...currentCart, products: updatedProducts });
  }
  addToCartByQuantityOptimistic(product: Product, price: number, quantity: number = 1) {
    const foundedProduct = this.cart().products.find((item) => item.product._id === product._id);
    const currentCount = foundedProduct?.count ?? 0;
    const updatedCart = this.cart();
    if (foundedProduct) {
      const updatedProducts = updatedCart.products.map((item) => {
        if (item.product._id === product._id) {
          return { ...item, count: quantity + currentCount };
        } else {
          return { ...item };
        }
      });
      this.cart.set({ ...updatedCart, products: updatedProducts });
    } else {
      this.addToCartOptimistic(product, price, quantity);
    }
  }

  clearCartOptimistic() {
    this.cart.set({ cartId: '', cartOwner: '', products: [], totalCartPrice: 0 });
  }

  totalCartItemOptimistic = computed(() =>
    this.cart().products.reduce((acc, curr) => (acc += curr.count), 0),
  );

  productsWithTotalPrice = computed(() =>
    this.cart().products.map((item) => ({
      ...item,
      totalPrice: item.price * item.count,
    })),
  );

  //request add product to cart
  addToCart(productId: string): Observable<IAddToCartResponse> {
    return this.http.post<IAddToCartResponse>(`${environment.baseUrl}/api/v2/cart`, {
      productId: productId,
    });
  }

  //request get cart
  getLoggedUserCart(): Observable<ICartResponse> {
    return this.http.get<ICartResponse>(`${environment.baseUrl}/api/v2/cart`);
  }

  //request update count
  updateCartProductQuantity(id: string, count: number): Observable<ICartResponse> {
    return this.http.put<ICartResponse>(`${environment.baseUrl}/api/v2/cart/${id}`, {
      count: count,
    });
  }

  //add by quantity
  addToCartByQuantity(productId: string, quantity: number): Observable<ICartResponse> {
    return this.getLoggedUserCart().pipe(
      switchMap((res) => {
        const currentProduct = res.data.products.find((prod) => prod.product._id === productId);
        const currentCount = currentProduct?.count ?? 0;
        if (currentProduct) {
          return this.updateCartProductQuantity(productId, quantity + currentCount);
        } else {
          return this.addToCart(productId).pipe(
            switchMap(() => this.updateCartProductQuantity(productId, quantity + currentCount)),
          );
        }
      }),
    );
  }
  //Apply coupon
  applyCoupon(couponName: string) {
    return this.http.put<any>(`${environment.baseUrl}/api/v2/cart/applyCoupon`, {
      couponName,
    });
  }

  //request Delete from cart
  removeProductFromCart(id: string): Observable<ICartResponse> {
    return this.http.delete<ICartResponse>(`${environment.baseUrl}/api/v2/cart/${id}`);
  }

  //request to clear cart

  ClearUserCart(): Observable<ICartResponse> {
    return this.http.delete<ICartResponse>(`${environment.baseUrl}/api/v2/cart`);
  }
}
