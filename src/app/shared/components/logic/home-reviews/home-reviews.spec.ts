import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeReviews } from './home-reviews';

describe('HomeReviews', () => {
  let component: HomeReviews;
  let fixture: ComponentFixture<HomeReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeReviews],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
