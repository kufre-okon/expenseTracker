import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AccountModel } from '../../../models/account';
import { AlertService } from '../../../services/alert.service';
import * as moment from 'moment';
import { SettingsService } from '../../../services/settings.service';
import { AppRuntimeService } from '../../../app-runtime.service';


@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.page.html',
  styleUrls: ['./account-detail.page.scss'],
})
export class AccountDetailPage implements OnInit {

  currencySymbol: any;
  account: any = {};

  constructor(
    private accountServ: AccountService,
    private alertServ: AlertService,
    private activatedRoute: ActivatedRoute,
    private setServ: SettingsService,
    private navCtrl: NavController,
    public global: AppRuntimeService) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.getAccount(id);
    }
  }

  ngOnInit() {
    this.currencySymbol = this.global.currencySymbol;
  }

  getAccount(id: any) {
    this.accountServ.getAccount(id).then((data) => {
      this.account = data;
      this.getTransactions();
    }).catch((err) => {
      this.alertServ.presentOkAlert('Error', err);
    });
  }

  getTransactions() {
    console.log(this.account.accountId);
  }
}
