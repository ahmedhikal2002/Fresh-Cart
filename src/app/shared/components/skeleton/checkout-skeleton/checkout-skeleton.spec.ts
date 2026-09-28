import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSkeleton } from './checkout-skeleton';

describe('CheckoutSkeleton', () => {
  let component: CheckoutSkeleton;
  let fixture: ComponentFixture<CheckoutSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
