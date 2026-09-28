import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-addresses-skeleton',
  imports: [],
  templateUrl: './user-addresses-skeleton.html',
  styleUrl: './user-addresses-skeleton.scss',
})
export class UserAddressesSkeleton {
  cardsCount = input<number>(4);
}
