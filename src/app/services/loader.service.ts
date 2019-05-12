import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private loadingController: LoadingController) { }

  async create(message?: string, duration?: number): Promise<HTMLIonLoadingElement> {
    let instance = await this.loadingController.create({
      message: message || 'Please wait...',
      duration: duration || 0
    });
    return await instance.present().then(() => {
      return instance;
    });
  }
}
