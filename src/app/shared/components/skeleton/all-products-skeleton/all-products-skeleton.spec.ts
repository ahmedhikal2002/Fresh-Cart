import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProductsSkeleton } from './all-products-skeleton';

describe('AllProductsSkeleton', () => {
  let component: AllProductsSkeleton;
  let fixture: ComponentFixture<AllProductsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProductsSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(AllProductsSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
