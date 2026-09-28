import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategories } from './all-categories';

describe('AllCategories', () => {
  let component: AllCategories;
  let fixture: ComponentFixture<AllCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(AllCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
