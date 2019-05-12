import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../app-constants';
import { Storage } from '@ionic/storage';
import { BudgetService } from '../../services/budget.service';
import { Budget } from '../../models/budget';
import { AlertService } from '../../services/alert.service';
import { Utils } from '../../utils';
import { AppRuntimeService } from '../../app-runtime.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-budget',
  templateUrl: './budgets.page.html',
  styleUrls: ['./budgets.page.scss'],
})
export class BudgetPage implements OnInit {

  budgets: Array<any>;

  constructor(private storage: Storage,
    private budServ: BudgetService,
    private alertServ: AlertService,
    private navCtrl: NavController,
    private global: AppRuntimeService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBudgets();
  }

  setAsActive(budgetId: any) {
    this.storage.set(AppConstants.ACTIVE_BUDGET_KEY, budgetId);
  }

  getBudgets() {
    this.budServ.getbudgets().then(data => {
      this.budgets = data;
      console.log(data);
      this.budgets.forEach(i => {
        i.startDate = Utils.getFrontEndDate(i.startDate, this.global.dateFormat);
        i.endDate = Utils.getFrontEndDate(i.endDate, this.global.dateFormat);
      });
    }).catch(err => {
      this.alertServ.presentOkAlert("Error", err);
    });
  }

  addBudget() {
    this.navCtrl.navigateForward('budgets/add');
  }

  editBudget(budget: Budget) {
    this.navCtrl.navigateForward('budgets/' + budget.budgetId);
  }

  details(budget: Budget) {
    this.navCtrl.navigateForward('budgets/' + budget.budgetId + '/detail');
  }

  /*
   // Or to get a key/value pair
    this.storage.get('age').then((val) => {
      console.log('Your age is', val);
    });
    */
}
