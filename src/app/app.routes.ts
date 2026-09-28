import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { NotFound } from './pages/not-found/not-found';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { cartGuard } from './core/guards/cart-guard';
import { loginGuard } from './core/guards/login-guard';
import { checkoutGuard } from './core/guards/checkout-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home/home').then((c) => c.Home) },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart').then((c) => c.Cart),
        canActivate: [cartGuard],
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then((c) => c.Products),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./pages/product-details/product-details').then((c) => c.ProductDetails),
      },
      {
        path: 'category/:id',
        loadComponent: () =>
          import('./pages/category-details/category-details').then((c) => c.CategoryDetails),
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories').then((c) => c.Categories),
      },
      {
        path: 'order/:id',
        loadComponent: () =>
          import('./pages/order-details/order-details').then((c) => c.OrderDetails),
      },
      {
        path: 'checkout',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./pages/checkout/checkout').then((c) => c.Checkout),
      },
      {
        path: 'brand/:id',

        loadComponent: () =>
          import('./pages/brand-details/brand-details').then((c) => c.BrandDetails),
      },
      {
        path: 'wishlist',
        canActivate: [cartGuard],
        loadComponent: () => import('./pages/wishlist/wishlist').then((c) => c.Wishlist),
      },
      {
        path: 'profile',
        canActivate: [cartGuard],
        loadComponent: () => import('./pages/profile/profile').then((c) => c.Profile),
      },
      {
        path: 'allorders',
        canActivate: [cartGuard],
        loadComponent: () => import('./pages/all-orders/all-orders').then((c) => c.AllOrders),
      },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    canActivate: [loginGuard],
    children: [
      { path: 'login', loadComponent: () => import('./pages/login/login').then((l) => l.Login) },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then((r) => r.Register),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password').then((c) => c.ForgotPassword),
      },
    ],
  },

  { path: '**', component: NotFound },
];
