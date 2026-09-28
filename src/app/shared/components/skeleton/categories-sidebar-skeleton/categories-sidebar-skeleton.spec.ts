import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSidebarSkeleton } from './categories-sidebar-skeleton';

describe('CategoriesSidebarSkeleton', () => {
  let component: CategoriesSidebarSkeleton;
  let fixture: ComponentFixture<CategoriesSidebarSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesSidebarSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesSidebarSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
