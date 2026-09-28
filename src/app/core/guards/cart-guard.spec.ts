import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cartGuardGuard } from './cart-guard';

describe('cartGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => cartGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
