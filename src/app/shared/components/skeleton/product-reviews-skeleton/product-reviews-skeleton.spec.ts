import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReviewsSkeleton } from './product-reviews-skeleton';

describe('ProductReviewsSkeleton', () => {
  let component: ProductReviewsSkeleton;
  let fixture: ComponentFixture<ProductReviewsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReviewsSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReviewsSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
