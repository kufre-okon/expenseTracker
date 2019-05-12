import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { LoaderService } from '../../../services/loader.service';
import { AccountService } from '../../../services/account.service';
import { AccountModel } from '../../../models/account';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { SettingsService } from '../../../services/settings.service';
import { Utils } from '../../../utils';
import { AppRuntimeService } from '../../../app-runtime.service';

@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.page.html',
  styleUrls: ['./add-edit-account.page.scss'],
})
export class AddEditAccountPage implements OnInit {

  attemptedSaved = false;
  accountForm: FormGroup;
  dateFormat: String;
  title = "New Account";

  validation_messages = {
    'name': [
      { type: 'required', message: 'Account name is required.' },
      { type: 'maxlength', message: 'Account name cannot be more than 200 characters long.' },
    ]
  };

  datePickerObj: any = {
    closeOnSelect: true, // default false
    titleLabel: 'Select a Date', // default null
    dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
    yearInAscending: true, // Default false
  };

  constructor(private alertServ: AlertService,
    private accountServ: AccountService,
    public fb: FormBuilder, 
    private loader: LoaderService,
    private activatedRoute: ActivatedRoute,
    private setServ: SettingsService,
    private navCtrl: NavController,
    public global: AppRuntimeService) {

    this.buildForm();
  }

  ngOnInit() {
    this.dateFormat = this.global.dateFormat;
    this.setDatePicker();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.title = "Edit Account";
      this.getAccount(id);
    }
  }

  setDatePicker() {
    this.datePickerObj.dateFormat = this.dateFormat;
    var maxDate = moment(new Date()).add(50, 'year');
    var minDate = moment(new Date()).subtract(100, 'year');
    this.datePickerObj.fromDate = new Date(minDate.format("YYYY-MM-DD"));
    this.datePickerObj.toDate = new Date(maxDate.format("YYYY-MM-DD"));
  }

  buildForm() {
    this.accountForm = this.fb.group({
      accountId: new FormControl({ value: null, disabled: true }),
      name: new FormControl('', Validators.compose([Validators.maxLength(200), Validators.required])),
      initialBalance: new FormControl(''),
      initialDate: new FormControl(''),
      note: new FormControl('')
    });
  }

  getAccount(id: any) {
    this.accountServ.getAccount(id).then((data) => {
      this.accountForm.patchValue({
        accountId: data.accountId,
        name: data.name,
        initialBalance: data.initialBalance,
        initialDate: (data.initialDate ? Utils.getFrontEndDate(data.initialDate, this.global.dateFormat)
          : data.initialDate),
        note: data.note
      });
    }).catch((err) => {
      this.alertServ.presentOkAlert('Error', err);
    });
  }

  // convenient way of getting form controls
  get form() { return this.accountForm.controls; }

  save() {
    this.attemptedSaved = true;
    if (this.accountForm.valid) {
      this.loader.create().then((inst) => {
        var form = <AccountModel>this.accountForm.getRawValue();
        if (form.initialDate) {
          form.initialDate = Utils.getBackEndDateFormat(form.initialDate, this.global.dateFormat);
        }
        this.accountServ.saveAccount(form).then((resp) => {
          inst.dismiss();
          this.alertServ.presentOkAlert('Success', 'Account saved.').then(() => {
            this.navCtrl.back();
          });
        }).catch(err => {
          this.alertServ.presentOkAlert('Error', err);
          inst.dismiss();
        });
      });
    }
  }


}
