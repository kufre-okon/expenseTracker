import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { SettingsService } from 'src/app/services/settings.service';
import { LoaderService } from '../../../services/loader.service';
import { NavController, ModalController } from '@ionic/angular';
import { BudgetService } from '../../../services/budget.service';
import { AddBudgetModalComponent } from '../../../shared/components/add-budget-modal/add-budget-modal.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
})
export class AddExpensePage implements OnInit {

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
    private settingServ: SettingsService,
    public fb: FormBuilder,
    private loader: LoaderService,
    private budServ: BudgetService,
    public modalContrl: ModalController,
    private location: Location,
    private navCtrl: NavController) {

    this.buildForm();
  }

  checkBudgetExistence() {
    this.budServ.getBudgetCounts().then(async data => {
      if (data < 1) {
        await this.alertServ.presentOkAlert('No Budget Configured!',
          'Please configure budget to post transactions.', null, async (resp) => {
            const modal = await this.modalContrl.create({
              component: AddBudgetModalComponent,
              backdropDismiss: false
            });
            await modal.present();
            modal.onDidDismiss().then((result) => {
              let modalData = result.data;
              // check if the modal was simply dismissed by the user and
              // return back to the previous page since we can't create any transaction at
              // this stage
              if (modalData && modalData.cancelled) {
                this.location.back();
              }
            });
          });
      }
    });
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
    this.getSettings();
  }

  ionViewWillEnter() {
    this.checkBudgetExistence();
  }

  save() {
    /* this.attemptedSaved = true;
     if (this.settingForm.valid) {
       this.loader.create().then((inst) => {
         var form = <Settings>this.settingForm.getRawValue();
         this.settingServ.saveSetting(form).then((resp) => {
           inst.dismiss();
           this.alertServ.presentOkAlert('Success', 'Settings saved');
           this.settingServ.loadRuntimeSettings();
         }).catch(err => {
           this.alertServ.presentOkAlert('Error', err);
           inst.dismiss();
         });
       });
     } */
  }

}
