import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsSidebarSkeleton } from './brands-sidebar-skeleton';

describe('BrandsSidebarSkeleton', () => {
  let component: BrandsSidebarSkeleton;
  let fixture: ComponentFixture<BrandsSidebarSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsSidebarSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsSidebarSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
