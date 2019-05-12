import { Component, OnInit } from '@angular/core';
import { AccountModel } from '../../models/account';
import { AlertService } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { NavController } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';
import { AppRuntimeService } from '../../app-runtime.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html'
})
export class AccountsPage implements OnInit {

  accounts: Array<AccountModel>;
  totalAccountbalance = 0;

  constructor(private alertServ: AlertService,
    private acctServ: AccountService,
    public setServ: SettingsService,
    private navCtrl: NavController,
    public global: AppRuntimeService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getAccounts();
  }

  getAccounts() {
    this.acctServ.getAccounts().then(data => {
      this.accounts = data;
      this.totalAccountbalance = 0;
      this.accounts.forEach(acct => {
        this.totalAccountbalance = this.totalAccountbalance + (acct.initialBalance || 0);
      });
    }).catch(err => {
      this.alertServ.presentOkAlert("Error", err);
    });
  }

  addAccount() {
    this.navCtrl.navigateForward('accounts/add');
  }

  editAccount(account: AccountModel) {
    this.navCtrl.navigateForward('accounts/' + account.accountId);
  }

  details(account: AccountModel) {
    this.navCtrl.navigateForward('accounts/' + account.accountId + '/detail');
  }

}
