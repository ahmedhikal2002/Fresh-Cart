import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cart-skeleton',
  imports: [],
  templateUrl: './cart-skeleton.html',
  styleUrl: './cart-skeleton.scss',
})
export class CartSkeleton {
  length = input<number>(3);

  get CartItems() {
    return Array.from({ length: this.length() });
  }
}
