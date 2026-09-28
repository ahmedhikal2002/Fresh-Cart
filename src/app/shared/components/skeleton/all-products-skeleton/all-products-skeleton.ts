import { Component, input } from '@angular/core';

@Component({
  selector: 'app-all-products-skeleton',
  imports: [],
  templateUrl: './all-products-skeleton.html',
  styleUrl: './all-products-skeleton.scss',
})
export class AllProductsSkeleton {
  cardsCount = input<number>(6);
}
