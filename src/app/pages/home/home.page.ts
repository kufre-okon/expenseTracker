import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { AppRuntimeService } from '../../app-runtime.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  current = 35;
  color = "#3880ff";

  constructor(
    public actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private router: Router,
    public global: AppRuntimeService) {

  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Operation',
      mode: "md",
      buttons: [{
        text: 'Add Expense',
        role: "destructive",
        icon: 'cloud-upload',
        handler: () => {
          this.router.navigate(['transactions/expense']);
        }
      }, {
        text: 'Add Income',
        role: "destructive",
        icon: 'cloud-download',
        handler: () => {
          this.router.navigate(['transactions/income']);
        }
      }, {
        text: 'Add Category',
        icon: 'filing',
        role: "destructive",
        handler: () => {
          let navExtras: NavigationExtras = {
            state: {
              type: 2
            }
          };
          this.router.navigate(['category/add'], navExtras);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
  }

  AddInc() {
    this.current = this.current + 5;
    if (this.current >= 65 && this.current <= 79) {
      this.color = "#f79b11";
    } else if (this.current >= 80) {
      this.color = "#f04141";
    } else {
      this.color = "#3880ff";
    }
  }

  ngOnInit() {

  }



}
