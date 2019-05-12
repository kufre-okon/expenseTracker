import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Settings } from '../models/settings';
import { IdNamePair } from '../models/idnamepair';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private api: ApiService) {

  }

  /**
   * Call to init Settings after API service finish initialization
   */
  loadRuntimeSettings(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var self = this;
      console.log('settings is loading...');
      let dateFormats: Array<IdNamePair>;
      let timeFormats: Array<IdNamePair>;
      this.getTimeFormats().then((tfs) => {
        timeFormats = tfs;       
        console.log('TF is loaded...');
        this.getDateFormats().then((dfs) => {
          dateFormats = dfs;
          console.log('DF is loaded...');
          this.getSettings().then((set) => {
            console.log('Settings is loaded...');
            let dformat = dateFormats.find(e => {
              return e.Id === set.dateFormatId;
            });
            let tformat = timeFormats.find(e => {
              return e.Id === set.timeFormatId;
            });
            let appSet = {
              currencySymbol: set.currencySymbol,
              dateFormat: dformat.Name,
              timeFormat: tformat.Name,
              enableDailyReminderNotification: set.enableDailyReminderNotification,
              enableLock: set.enableLock
            };
            resolve(appSet);
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  getSettings(): Promise<Settings> {
    return this.api.db.executeSql(`SELECT * FROM settings`, []).then((data) => {
      let len = data.rows.length;
      let model: Settings;
      if (len > 0) {
        let item: any = data.rows.item(0);
        model = {
          dateFormatId: item.dateFormatId,
          currencySymbol: item.currencySymbol,
          enableDailyReminderNotification: item.enableDailyReminderNotification,
          enableLock: item.enableLock,
          settingId: item.settingId,
          timeFormatId: item.timeFormatId,
          pinCode: item.pinCode
        };
      }
      return model;
    });
  }

  getTimeFormats(): Promise<IdNamePair[]> {
    return this.api.getTimeFormats();
  }

  getDateFormats(): Promise<IdNamePair[]> {
    return this.api.getDateFormats();
  }

  saveSetting(setting: Settings): Promise<Settings> {
    if (setting.settingId > 0) {
      return this.api.db.executeSql(`UPDATE settings SET dateFormatId=?,currencySymbol=?,enableDailyReminderNotification=?,
      enableLock=?,pinCode=?,timeFormatId=? WHERE settingId=?`, [setting.dateFormatId, setting.currencySymbol,
        setting.enableDailyReminderNotification, setting.enableLock, setting.pinCode, setting.timeFormatId, setting.settingId])
        .then(async res => {
          return setting;
        });
    } else {
      return this.api.db.executeSql(`INSERT INTO settings(settingId,dateFormatId,currencySymbol,enableDailyReminderNotification,
        enableLock,timeFormatId) VALUES(NULL,?,?,?,?,?,?)`, [setting.dateFormatId, setting.currencySymbol,
        setting.enableDailyReminderNotification, setting.enableLock, setting.pinCode, setting.timeFormatId])
        .then(async res => {
          return setting;
        });
    }
  }
}
