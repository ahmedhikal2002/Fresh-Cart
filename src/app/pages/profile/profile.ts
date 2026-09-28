import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service';

import { ChangePassword } from '../../shared/components/logic/change-password/change-password';
import { EditProfile } from '../../shared/components/logic/edit-profile/edit-profile';
import { UserAddresses } from '../../shared/components/logic/user-addresses/user-addresses';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [UserAddresses, ChangePassword, EditProfile],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  changePassword = signal<boolean>(false);
  editProfile = signal<boolean>(false);
  protected readonly user = computed(() => {
    const _userDate = this.authService.userData();
    const userName = _userDate?.name?.split(' ')[0]?.charAt(0).toUpperCase() || '';
    const email = _userDate?.email || '';
    const name = _userDate?.name;
    return { email, userName, name };
  });

  toggleChangePassword() {
    this.changePassword.update((state) => !state);
    if (this.changePassword()) {
      this.editProfile.set(false);
    }
  }
  closeChangePasswordFrom() {
    this.changePassword.set(false);
  }

  toggleEditProfile() {
    this.editProfile.update((state) => !state);
    if (this.editProfile()) {
      this.changePassword.set(false);
    }
  }

  closeEditProfile() {
    this.editProfile.set(false);
  }

  signOut() {
    this.authService.logOut();
  }
}
