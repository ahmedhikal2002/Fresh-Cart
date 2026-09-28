import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddressesSkeleton } from './user-addresses-skeleton';

describe('UserAddressesSkeleton', () => {
  let component: UserAddressesSkeleton;
  let fixture: ComponentFixture<UserAddressesSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddressesSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddressesSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
