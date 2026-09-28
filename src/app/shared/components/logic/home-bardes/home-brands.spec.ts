import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBardes } from './home-bardes';

describe('HomeBardes', () => {
  let component: HomeBardes;
  let fixture: ComponentFixture<HomeBardes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBardes],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBardes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
