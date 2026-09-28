import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddresses } from './user-addresses';

describe('UserAddresses', () => {
  let component: UserAddresses;
  let fixture: ComponentFixture<UserAddresses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddresses],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddresses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
