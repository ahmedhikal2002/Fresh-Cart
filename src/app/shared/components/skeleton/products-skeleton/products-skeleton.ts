import { Component, input } from '@angular/core';

@Component({
  selector: 'app-products-skeleton',
  imports: [],
  templateUrl: './products-skeleton.html',
  styleUrl: './products-skeleton.scss',
})
export class ProductsSkeleton {
  length = input<number>(0);

  get Products() {
    return Array.from({ length: this.length() });
  }
}
