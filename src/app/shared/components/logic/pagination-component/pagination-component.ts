import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  imports: [],
  templateUrl: './pagination-component.html',
  styleUrl: './pagination-component.scss',
})
export class PaginationComponent {
  currentPage = input<number>(1);
  numberOfPages = input<number>(1);
  action = output<number>();

  goToPage(page: number) {
    if (page < 1 || page > this.numberOfPages() || page === this.currentPage()) {
      return;
    }

    this.action.emit(page);
  }
  nextPage() {
    if (this.currentPage() >= this.numberOfPages()) {
      return;
    }
    this.action.emit(this.currentPage() + 1);
  }
  prevPage() {
    if (this.currentPage() <= 1) {
      return;
    }
    this.action.emit(this.currentPage() - 1);
  }
  get pages(): number[] {
    return Array.from({ length: this.numberOfPages() }, (_, i) => i + 1);
  }
}
