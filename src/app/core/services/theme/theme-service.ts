import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // ✅ signal واحد
  private readonly _theme = signal<Theme>('light');

  // ✅ read-only للـ components
  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    if (this.isBrowser) {
      const stored = (localStorage.getItem('mode') as Theme) || 'light';
      this.setTheme(stored);
    }
  }

  // ===== Toggle =====
  toggleMode(): void {
    if (!this.isBrowser) return;
    this.setTheme(this._theme() === 'light' ? 'dark' : 'light');
  }

  // ===== Set =====
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.applyTheme(theme);

    if (this.isBrowser) {
      localStorage.setItem('mode', theme);
    }
  }

  // ===== Apply =====
  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    html.style.colorScheme = theme;
  }
}
