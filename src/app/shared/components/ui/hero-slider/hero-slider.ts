import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-hero-slider',
  imports: [CarouselModule],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.scss',
})
export class HeroSlider {
  sliderImages = [
    { src: '/images/img1.avif', alt: 'Slider image 1' },
    { src: '/images/img2.avif', alt: 'Slider image 2' },
    { src: '/images/img7.avif', alt: 'Slider image 3' },
    { src: '/images/img4.avif', alt: 'Slider image 4' },
    { src: '/images/img5.avif', alt: 'Slider image 5' },
    { src: '/images/img6.avif', alt: 'Slider image 6' },
  ];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    autoplaySpeed: 500,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-chevron-left"></i>',
      '<i class="fa-solid fa-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };
}
