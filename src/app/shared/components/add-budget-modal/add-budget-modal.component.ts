import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Budget } from '../../../models/budget';
import { Utils } from '../../../utils';
import { AppRuntimeService } from '../../../app-runtime.service';
import { BudgetService } from '../../../services/budget.service';
import { AlertService } from '../../../services/alert.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-budget-modal',
  templateUrl: './add-budget-modal.component.html',
  styleUrls: ['./add-budget-modal.component.scss'],
})
export class AddBudgetModalComponent implements OnInit {

  attemptedSaved = false;
  budgetForm: FormGroup;

  validation_messages = {
    'name': [
      { type: 'required', message: 'Budget name is required.' },
      { type: 'maxlength', message: 'Budget name cannot be more than 50 characters long.' },
    ],
    'note': [
      { type: 'maxlength', message: 'Budget note cannot be more than 200 characters long.' },
    ],
    'startDate': [
      { type: 'required', message: 'Budget start date is required.' }
    ],
    'endDate': [
      { type: 'required', message: 'Budget end date is required.' }
    ],
  };

  datePickerObj: any = {
    closeOnSelect: true, // default false
    titleLabel: 'Select a Date', // default null
    dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
    yearInAscending: true, // Default false
  };


  constructor(
    private alertServ: AlertService,
    public viewCtrl: ModalController,
    public fb: FormBuilder,
    private loader: LoaderService,
    public global: AppRuntimeService,
    private budgetServ: BudgetService
  ) {
    this.buildForm();
   }

  ngOnInit() { 
    this.setDatePicker();
  }

  setDatePicker() {
    this.datePickerObj.dateFormat = this.global.dateFormat;
    var maxDate = moment(new Date()).add(50, 'year');
    var minDate = moment(new Date()).subtract(100, 'year');
    this.datePickerObj.fromDate = new Date(minDate.format("YYYY-MM-DD"));
    this.datePickerObj.toDate = new Date(maxDate.format("YYYY-MM-DD"));
  }

  buildForm() {
    this.budgetForm = this.fb.group({
      budgetId: new FormControl({ value: null, disabled: true }),
      name: new FormControl('', Validators.compose([Validators.maxLength(50), Validators.required])),
      note: new FormControl('', Validators.compose([Validators.maxLength(200)])),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    });
  }

  // convenient way of getting form controls
  get form() { return this.budgetForm.controls; }

  save() {
    this.attemptedSaved = true;
    if (this.budgetForm.valid) {
      this.loader.create().then((inst) => {
        var form = <Budget>this.budgetForm.getRawValue();
        if (form.startDate) {
          form.startDate = Utils.getBackEndDateFormat(form.startDate, this.global.dateFormat);
        }
        this.budgetServ.saveBudget(form).then((resp) => {
          inst.dismiss();
          this.alertServ.presentOkAlert('Success', 'Budget saved.').then(() => {
            this.viewCtrl.dismiss({ cancelled: false });
          });
        }).catch(err => {
          this.alertServ.presentOkAlert('Error', err);
          inst.dismiss();
        });
      });
    }
  }

  close() {
    this.viewCtrl.dismiss({ cancelled: true });
  }
}
