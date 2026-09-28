import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import {
  IAddressResponse,
  IChangePassword,
  IEditProfile,
  IGetAddress,
  ISpecificAddress,
  userAddress,
} from '../../../shared/interfaces/profile/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  getLoggedUserAddresses(): Observable<IGetAddress> {
    return this.http.get<IGetAddress>(`${environment.baseUrl}/api/v1/addresses`);
  }

  addAddress(address: userAddress): Observable<IAddressResponse> {
    return this.http.post<IAddressResponse>(`${environment.baseUrl}/api/v1/addresses`, {
      name: address.name,
      city: address.city,
      phone: address.phone,
      details: address.details,
    });
  }

  removeAddress(addressId: string): Observable<IAddressResponse> {
    return this.http.delete<IAddressResponse>(
      `${environment.baseUrl}/api/v1/addresses/${addressId}`,
    );
  }
  getSpecificAddress(addressId: string): Observable<ISpecificAddress> {
    return this.http.get<ISpecificAddress>(`${environment.baseUrl}/api/v1/addresses/${addressId}`);
  }

  updateLoggedUserPassword(
    currentPassword: string,
    password: string,
    rePassword: string,
  ): Observable<IChangePassword> {
    return this.http.put<IChangePassword>(`${environment.baseUrl}/api/v1/users/changeMyPassword`, {
      currentPassword,
      password,
      rePassword,
    });
  }

  UpdateLoggedUserData(name: string, email: string, phone: string): Observable<IEditProfile> {
    return this.http.put<IEditProfile>(`${environment.baseUrl}/api/v1/users/updateMe/`, {
      name,
      email,
      phone,
    });
  }
}
