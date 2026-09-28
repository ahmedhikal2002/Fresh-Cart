import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  // toast(message: string, title: string = '', timeOut = 5000) {
  //   this.toastr.show(message, title, { timeOut: timeOut });
  // }
  toastSuccess(message: string, title = '', timeOut = 5000) {
    if (this.isBrowser) {
      this.toastr.success(message, title, { timeOut });
    }
  }
  toast(message: string, title = '', timeOut = 5000) {
    if (this.isBrowser) {
      this.toastr.info(message, title, { timeOut });
    }
  }

  toastWarning(message: string, title = '', timeOut = 5000) {
    if (this.isBrowser) {
      this.toastr.warning(message, title, { timeOut });
    }
  }

  ToastError(message: string, title = '', timeOut = 5000) {
    if (this.isBrowser) {
      this.toastr.error(message, title, { timeOut });
    }
  }
}
