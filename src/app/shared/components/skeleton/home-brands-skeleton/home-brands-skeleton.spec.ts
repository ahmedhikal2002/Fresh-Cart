import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBrandsSkeleton } from './home-brands-skeleton';

describe('HomeBrandsSkeleton', () => {
  let component: HomeBrandsSkeleton;
  let fixture: ComponentFixture<HomeBrandsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBrandsSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBrandsSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
