import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrdersSkeleton } from './all-orders-skeleton';

describe('AllOrdersSkeleton', () => {
  let component: AllOrdersSkeleton;
  let fixture: ComponentFixture<AllOrdersSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOrdersSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(AllOrdersSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
