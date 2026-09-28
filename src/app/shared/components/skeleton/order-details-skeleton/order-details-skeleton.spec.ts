import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsSkeleton } from './order-details-skeleton';

describe('OrderDetailsSkeleton', () => {
  let component: OrderDetailsSkeleton;
  let fixture: ComponentFixture<OrderDetailsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
