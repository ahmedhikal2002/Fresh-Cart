import { Component, input, signal } from '@angular/core';
import { IReview } from '../../../interfaces/reviews/reviews';

@Component({
  selector: 'app-review-card',
  imports: [],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
})
export class ReviewCard {
  review = input<IReview>();
}
