import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSkeleton } from './cart-skeleton';

describe('CartSkeleton', () => {
  let component: CartSkeleton;
  let fixture: ComponentFixture<CartSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
