import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsSideBar } from './brands-side-bar';

describe('BrandsSideBar', () => {
  let component: BrandsSideBar;
  let fixture: ComponentFixture<BrandsSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsSideBar],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsSideBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
