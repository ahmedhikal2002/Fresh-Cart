import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSideBar } from './categories-side-bar';

describe('CategoriesSideBar', () => {
  let component: CategoriesSideBar;
  let fixture: ComponentFixture<CategoriesSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesSideBar],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesSideBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
