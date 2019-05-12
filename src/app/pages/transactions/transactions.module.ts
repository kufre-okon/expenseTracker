import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TransactionsPage } from './transactions.page';
import { TransactionRoutingModule } from './transaction-routing.module';
import { AddExpensePage } from './add-expense/add-expense.page';
import { AddIncomePage } from './add-income/add-income.page';
import { DetailPage } from './detail/detail.page';
import { NavLinksComponent } from './nav-links/nav-links.component';
import { SharedModule } from '../../shared/shared-module/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionRoutingModule,
    SharedModule
  ],
  declarations: [
    TransactionsPage,
    AddExpensePage,
    AddIncomePage,
    DetailPage,
    NavLinksComponent
  ],
  entryComponents: [
    NavLinksComponent
  ]
})
export class TransactionsPageModule { }
