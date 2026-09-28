import { TestBed } from '@angular/core/testing';

import { Themeservice } from './themeservice';

describe('Themeservice', () => {
  let service: Themeservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Themeservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
