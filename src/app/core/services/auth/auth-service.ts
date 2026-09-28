import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IUserRegister } from '../../../shared/interfaces/auth/Register/IUserRegister';
import { IRegisterResponse } from '../../../shared/interfaces/auth/Register/IRegisterResponse';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { isUserLogin } from '../../../shared/interfaces/auth/login/IUserLogin';
import { ILoginResponse } from '../../../shared/interfaces/auth/login/ILoginResponse';
import { IEmail } from '../../../shared/interfaces/auth/forget-password/IEmail';
import { IResetCode } from '../../../shared/interfaces/auth/forget-password/IResetCode';
import { IVerifyEmailResponse } from '../../../shared/interfaces/auth/forget-password/IVerifyEmailResponse';
import { IVerifyResetCodeResponse } from '../../../shared/interfaces/auth/forget-password/IVerifyResetCodeResponse';
import { IResetPassword } from '../../../shared/interfaces/auth/forget-password/IResetPassword';
import { IResetPasswordResponse } from '../../../shared/interfaces/auth/forget-password/IResetPasswordResponse';
import { IUserDate, IUserPayload } from '../../../shared/interfaces/auth/user-data/IUserPayload';
import { IVerifyTokenResponse } from '../../../shared/interfaces/auth/verify-token/IVerifyTokenResponse ';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<IUserPayload | null>(null);
  userData = signal<IUserDate | null>(null);
  private token = signal<string | null>(null);
  private router = inject(Router);
  private readonly ID = inject(PLATFORM_ID);
  constructor(private http: HttpClient) {
    let savedToken: string | null = null;
    if (isPlatformBrowser(this.ID)) {
      const userData = JSON.parse(localStorage.getItem('userData') ?? '{}');
      const token = userData?.token ?? null;
      token ? (savedToken = token) : (savedToken = null);
    }

    this.token.set(savedToken);
    if (savedToken) {
      this.getUserData();
    }
  }

  isUSerLoggedIn = computed(() => (this.token() ? true : false));

  signUp(user: IUserRegister): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(`${environment.baseUrl}/api/v1/auth/signup`, user);
  }
  login(user: isUserLogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${environment.baseUrl}/api/v1/auth/signin`, user);
  }

  private getUserData(): IUserPayload | null {
    if (isPlatformBrowser(this.ID)) {
      const userData = JSON.parse(localStorage.getItem('userData') ?? '{}');

      const token = userData?.token ?? null;
      this.userData.set(userData);
      if (token) {
        try {
          const decoded: IUserPayload = jwtDecode(token);
          this.currentUser.set(decoded);
          return decoded;
        } catch (error) {
          this.currentUser.set(null);
          return null;
        }
      }
    }
    return null;
  }
  saveUserData(userData: IUserDate) {
    this.token.set(userData.token);

    if (isPlatformBrowser(this.ID)) {
      localStorage.setItem('userData', JSON.stringify(userData));
      this.userData.set(userData);
      this.getUserData();
    }
  }

  retrieveUser(): IUserDate | null {
    if (isPlatformBrowser(this.ID)) {
      const data = localStorage.getItem('userData');

      return data ? JSON.parse(data) : null;
    }
    return null;
  }
  getUserToken(): string | null {
    return this.token();
  }

  verifyToken(): Observable<IVerifyTokenResponse> {
    return this.http.get<IVerifyTokenResponse>(`${environment.baseUrl}/api/v1/auth/verifyToken
`);
  }

  verifyEmail(email: IEmail): Observable<IVerifyEmailResponse> {
    return this.http.post<IVerifyEmailResponse>(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      email,
    );
  }
  verifyResetCode(code: IResetCode): Observable<IVerifyResetCodeResponse> {
    return this.http.post<IVerifyResetCodeResponse>(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      code,
    );
  }

  resetPassword(resetAccount: IResetPassword): Observable<IResetPasswordResponse> {
    return this.http.put<IResetPasswordResponse>(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      resetAccount,
    );
  }
  logOut() {
    if (isPlatformBrowser(this.ID)) {
      localStorage.removeItem('userData');
      this.token.set(null);
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    }
  }
}
