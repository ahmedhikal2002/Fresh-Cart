import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSkeleton } from './categories-skeleton';

describe('CategoriesSkeleton', () => {
  let component: CategoriesSkeleton;
  let fixture: ComponentFixture<CategoriesSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
