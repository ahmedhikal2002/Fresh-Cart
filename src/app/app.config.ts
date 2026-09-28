import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  HttpErrorResponse,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { headersInterceptor } from './core/interceptors/headers/headers-interceptor';
import { errorInterceptor } from './core/interceptors/error/error-interceptor';
import { AuthService } from './core/services/auth/auth-service';
import { catchError, EMPTY, throwError } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([headersInterceptor, errorInterceptor])),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      closeButton: true,
      progressBar: true,
    }),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      const token = authService.getUserToken();
      if (!token) return;
      return authService.verifyToken().pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            authService.logOut();
          }
          return EMPTY;
        }),
      );
    }),
  ],
};
