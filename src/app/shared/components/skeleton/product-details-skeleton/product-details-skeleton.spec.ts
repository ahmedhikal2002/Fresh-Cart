import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsSkeleton } from './product-details-skeleton';

describe('ProductDetailsSkeleton', () => {
  let component: ProductDetailsSkeleton;
  let fixture: ComponentFixture<ProductDetailsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
