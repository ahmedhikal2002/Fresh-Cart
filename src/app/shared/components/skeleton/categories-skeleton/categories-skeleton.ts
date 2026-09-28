import { Component } from '@angular/core';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-categories-skeleton',
  imports: [CarouselModule],
  templateUrl: './categories-skeleton.html',
  styleUrl: './categories-skeleton.scss',
})
export class CategoriesSkeleton {
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: false,
    autoplayHoverPause: true,
    autoplaySpeed: 1000,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      1100: {
        items: 5,
      },
      1400: {
        items: 6,
      },
    },
    nav: false,
  };
}
