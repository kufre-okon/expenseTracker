import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuService } from './services/menu.service';
import { AppConstants } from './app-constants';
import { timer } from 'rxjs';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { ApiService } from './services/api.service';
import { SettingsService } from './services/settings.service';
import { AppRuntimeService } from './app-runtime.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  appMenus = [];
  app_name = "";
  app_description = "";


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuServ: MenuService,
    private storage: SQLite,
    public setServ: SettingsService,
    public global: AppRuntimeService
  ) {
    this.initializeApp();
    this.app_name = AppConstants.APP_NAME;
    this.app_description = AppConstants.APP_DESCRIPTION;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.appMenus = this.menuServ.getMenus();
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);
      // set status bar background
      this.statusBar.backgroundColorByHexString('#b46e04');
      // the setTimeout delay should be equal to FadeSplashScreenDuration param value in config.xml
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);

      try {
        this.setServ.loadRuntimeSettings().then((data) => {
          console.log(data);
          this.global.currencySymbol = data.currencySymbol;
          this.global.dateFormat = data.dateFormat;
          this.global.timeFormat = data.timeFormat;
          this.global.enableDailyReminderNotification = data.enableDailyReminderNotification;
          this.global.enableLock = data.enableLock;
        });
      } catch (err) {
        console.log('Error=>', err);
      }
    });
  }
}

