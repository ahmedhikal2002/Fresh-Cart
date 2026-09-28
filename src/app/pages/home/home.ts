import { Component } from '@angular/core';
import { HeroSlider } from '../../shared/components/ui/hero-slider/hero-slider';
import { AllCategories } from '../../shared/components/logic/all-categories/all-categories';
import { HomeProducts } from '../../shared/components/logic/home-products/home-products';
import { HomeBardes } from '../../shared/components/logic/home-bardes/home-brands';
import { HomeReviews } from '../../shared/components/logic/home-reviews/home-reviews';

@Component({
  selector: 'app-home',
  imports: [HeroSlider, AllCategories, HomeProducts, HomeBardes, HomeReviews],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
