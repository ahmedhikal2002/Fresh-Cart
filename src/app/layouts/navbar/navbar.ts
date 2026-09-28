import {
  Component,
  computed,
  DestroyRef,
  inject,
  Inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { ThemeService } from '../../core/services/theme/theme-service';
import { CartService } from '../../core/services/cart/cart-service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist/wishlist-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../core/services/Toast/toast-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isAuthNavbar = input<boolean>(false);
  isUSerLogged = computed(() => this.authService.isUSerLoggedIn());
  userDate = computed(() => this.authService.currentUser());
  isMobileMenuOpen = signal(false);
  private themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private toastr = inject(ToastService);
  mode = this.themeService.theme;
  isDark = this.themeService.isDark;

  navLinks = [
    { path: '/home', label: 'Home', exact: true },
    { path: '/products', label: 'Products', exact: false },
    { path: '/categories', label: 'Categories', exact: false },
    { path: '/allorders', label: 'Orders', exact: false },
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', url: 'https://facebook.com' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com' },
    { icon: 'fab fa-instagram', url: 'https://instagram.com' },
    { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com' },
    { icon: 'fab fa-youtube', url: 'https://youtube.com' },
    { icon: 'fab fa-tiktok', url: 'https://tiktok.com' },
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((state) => !state);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  constructor(
    private authService: AuthService,
    private router: Router,

    protected cartService: CartService,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    protected wishlistService: WishlistService,
  ) {}

  loadWishList() {
    if (!this.isUSerLogged()) return;
    this.wishlistService
      .getLoggedUserWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.wishlistService.wishList.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.ToastError(err.error.message ?? err.message, 'Some thing went wrong');
        },
      });
  }
  loadCart() {
    if (!this.isUSerLogged()) return;
    this.cartService
      .getLoggedUserCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartService.cart.set(res.data);
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.ToastError(err.error.message ?? err.message, 'Some thing went wrong');
        },
      });
  }

  goToLogin() {
    const currentUrl = this.router.url;

    const returnUrl = currentUrl === '/login' ? '/home' : currentUrl;

    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl,
      },
    });
  }

  toggleMode(): void {
    this.themeService.toggleMode();
  }

  signOut(): void {
    this.authService.logOut();
  }

  ngOnInit(): void {
    //this.loadTheme();
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
      this.loadWishList();
    }
  }
}
