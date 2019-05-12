import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { AlertService } from '../../services/alert.service';
import { Settings } from '../../models/settings';
import { IdNamePair } from '../../models/idnamepair';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { LoaderService } from '../../services/loader.service';
import { AppRuntimeService } from '../../app-runtime.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  dateFormats: Array<IdNamePair>;
  timeFormats: Array<IdNamePair>;
  attemptedSaved = false;
  settingForm: FormGroup;

  validation_messages = {
    'currencySymbol': [
      { type: 'required', message: 'Currency symbol is required.' },
      { type: 'maxlength', message: 'Currency symbol cannot be more than 5 characters long.' },
    ],
    'dateFormatId': [
      { type: 'required', message: 'Date format is required.' }
    ],
    'timeFormatId': [
      { type: 'required', message: 'Time format is required.' }
    ],
    'pinCode': [
      { type: 'required', message: 'PIN Code is required.' },
      { type: 'minlength', message: 'PIN Code cannot be less than 4 characters long.' }
    ],
    'confirmPinCode': [
      { type: 'required', message: 'Please confirm your PIN code.' },
      { type: 'matchPin', message: 'PIN codes mismatch.' }
    ]
  };

  constructor(private alertServ: AlertService,
    public settingServ: SettingsService,
    public fb: FormBuilder,
    public global: AppRuntimeService,
    private loader: LoaderService) {

    this.buildForm();
  }

  buildForm() {
    this.settingForm = this.fb.group({
      settingId: new FormControl({ value: null, disabled: true }),
      currencySymbol: new FormControl('', Validators.compose([Validators.maxLength(5), Validators.required])),
      dateFormatId: new FormControl('', Validators.required),
      timeFormatId: new FormControl('', Validators.required),
      enableLock: new FormControl(false),
      enableDailyReminderNotification: new FormControl(false),
      pinCode: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
      confirmPinCode: new FormControl('', Validators.required)
    }, {
        validator: this.matchPin // Inject the provider method
      });
  }

  getEnums() {
    let currentDate = moment(new Date());
    this.settingServ.getDateFormats().then((data) => {
      this.dateFormats = data;
      this.dateFormats.forEach(e => {
        e.Name = e.Name + ' (' + currentDate.format(e.Name) + ')';
      });
    }).catch((err) => {
      this.alertServ.presentOkAlert('Error', err);
    });

    this.settingServ.getTimeFormats().then((data) => {
      this.timeFormats = data;
      this.timeFormats.forEach(e => {
        e.Name = e.Name + ' (' + currentDate.format(e.Name) + ')';
      });
    }).catch((err) => {
      this.alertServ.presentOkAlert('Error', err);
    });

  }

  getSettings() {
    this.settingServ.getSettings().then((data) => {
      this.settingForm.patchValue({
        settingId: data.settingId,
        currencySymbol: data.currencySymbol || '$',
        dateFormatId: data.dateFormatId,
        timeFormatId: data.timeFormatId,
        enableLock: data.enableLock,
        enableDailyReminderNotification: data.enableDailyReminderNotification,
        pinCode: data.pinCode,
        confirmPinCode: data.pinCode
      });
    }).catch((err) => {
      this.alertServ.presentOkAlert('Error', err);
    });
  }

  // convenient way of getting form controls
  get form() { return this.settingForm.controls; }

  ngOnInit() {
    this.getEnums();
    this.getSettings();
  }

  save() {
    this.attemptedSaved = true;
    if (this.settingForm.valid) {
      this.loader.create().then((inst) => {
        var form = <Settings>this.settingForm.getRawValue();
        this.settingServ.saveSetting(form).then((resp) => {
          inst.dismiss();
          this.alertServ.presentOkAlert('Success', 'Settings saved');
          this.refreshSettings();
        }).catch(err => {
          this.alertServ.presentOkAlert('Error', err);
          inst.dismiss();
        });
      });
    }
  }

  refreshSettings() {
    try {
      this.settingServ.loadRuntimeSettings().then((data) => {
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
  }

  private matchPin(AC: AbstractControl) {
    const pinCode = AC.get('pinCode').value; // to get value in input tag
    const confirmPinCode = AC.get('confirmPinCode').value; // to get value in input tag
    if (pinCode !== confirmPinCode) {
      // console.log('false');
      AC.get('confirmPinCode').setErrors({ matchPin: true });
    } else {
      // console.log('true');
      AC.get('confirmPinCode').setErrors(null);
    }
  }

}
