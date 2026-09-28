import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ThemeService } from '../theme/theme-service';

@Injectable({
  providedIn: 'root',
})
export class SweetAlert {
  private isDark!: boolean;
  constructor(private themeService: ThemeService) {}

  confirmDelete(
    title: string = 'Are you sure?',
    text: string = "You won't be able to revert this!",
  ): Promise<boolean> {
    this.isDark = this.themeService.theme() === 'dark';
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3a8958',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: this.isDark ? '#1f2937' : '#ffffff',
      color: this.isDark ? '#ffffff' : '#000000',
    }).then((result) => result.isConfirmed);
  }

  success(title: string, text?: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#3a8958',
      background: this.isDark ? '#1f2937' : '#ffffff',
      color: this.isDark ? '#ffffff' : '#000000',
    });
  }
  error(title: string, text?: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#d33',
      background: this.isDark ? '#1f2937' : '#ffffff',
      color: this.isDark ? '#ffffff' : '#000000',
    });
  }
}
