import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-ui-component',
  imports: [],
  templateUrl: './error-ui-component.html',
  styleUrl: './error-ui-component.scss',
})
export class ErrorUiComponent {
  message = input<string>('Something went wrong');

  retry = output<void>();
}
