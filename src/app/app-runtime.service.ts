import { Injectable } from '@angular/core';

@Injectable()
export class AppRuntimeService {

  public currencySymbol: string;
  public dateFormat: string;
  public timeFormat: string;
  public enableLock: boolean;
  public enableDailyReminderNotification: boolean;

  constructor() { }
}
