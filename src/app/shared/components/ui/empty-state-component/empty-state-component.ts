import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state-component',
  imports: [],
  templateUrl: './empty-state-component.html',
  styleUrl: './empty-state-component.scss',
})
export class EmptyStateComponent {
  title = input<string>('');
}
