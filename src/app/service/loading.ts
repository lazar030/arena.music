import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  isLoading = false;

  constructor(
    public loadingController: LoadingController
  ) {
  
  }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: ''
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => {});
        }
      })
    })
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {});
  }
}
