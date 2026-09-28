import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorUiComponent } from './error-ui-component';

describe('ErrorUiComponent', () => {
  let component: ErrorUiComponent;
  let fixture: ComponentFixture<ErrorUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorUiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
