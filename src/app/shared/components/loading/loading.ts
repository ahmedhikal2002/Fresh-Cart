import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading/loading-service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
