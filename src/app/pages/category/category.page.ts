import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { IdNamePair } from '../../models/idnamepair';
import { AlertService } from '../../services/alert.service';
import { ExpenseTypeEnum } from '../../models/expense-enum';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  expenseCategories: Array<Category>;
  incomeCategories: Array<Category>;
  isExpenseView = false;

  private bgColors = [
    'primary',
    'danger',
    'secondary',
    'tertiary',
    'warning',
    'success',
    'dark'
  ];

  constructor(private catServ: CategoryService,
    private alertServ: AlertService,
    private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
    this.expenseCategories = new Array<Category>();
    this.incomeCategories = new Array<Category>();
  }

  ionViewWillEnter() {
    this.getCategories();
  }

  getBadgebgColor(index) {
    let mode = index % this.bgColors.length;
    return this.bgColors[mode] || 'primary';
  }

  getCategories() {
    /*  for (var i = 0; i < 40; i++) {
        var item: Category = {
          Id: i,
          Name: "Cat " + i,
          type: ExpenseTypeEnum.Expense
        };
        this.expenseCategories.push(item);
      }
  */
    this.catServ.getExpenseCategories().then(data => {
      this.expenseCategories = data;
    }).catch(err => {
      this.alertServ.presentOkAlert("Error", err);
    });
    this.catServ.getIncomeCategories().then(data => {
      this.incomeCategories = data;
    }).catch(err => {
      this.alertServ.presentOkAlert("Error", err);
    });
  }

  segmentChanged(evt) {
    if (evt.detail.value === 'expense')
      this.isExpenseView = true;
    else
      this.isExpenseView = false;
  }

  addCategory() {
    let navExtras: NavigationExtras = {
      state: {
        type: this.isExpenseView ? 1 : 2
      }
    };
    this.router.navigate(['category/add'], navExtras);
  }

  editCategory(cat: Category) {
    this.navCtrl.navigateForward('category/' + cat.id);
  }

}
