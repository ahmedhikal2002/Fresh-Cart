import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeReviewsSkeleton } from './home-reviews-skeleton';

describe('HomeReviewsSkeleton', () => {
  let component: HomeReviewsSkeleton;
  let fixture: ComponentFixture<HomeReviewsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeReviewsSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeReviewsSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
