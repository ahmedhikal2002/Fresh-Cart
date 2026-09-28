import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategoriesSkeleton } from './all-categories-skeleton';

describe('AllCategoriesSkeleton', () => {
  let component: AllCategoriesSkeleton;
  let fixture: ComponentFixture<AllCategoriesSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCategoriesSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(AllCategoriesSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
