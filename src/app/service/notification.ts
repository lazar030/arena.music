import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastrService: NbToastrService
  ) { }

  async showSuccess(message) {
    this.toastrService.success(message, 'Success', {
      duration: 3000
    });
  }

  async showError(message) {
    this.toastrService.danger(message, 'Error', {
      duration: 3000
    });
  }

  async showWarning(message) {
    this.toastrService.warning(message, 'Warning', {
      duration: 3000
    });
  }

}
