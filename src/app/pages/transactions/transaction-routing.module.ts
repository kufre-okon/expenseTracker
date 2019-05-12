import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsPage } from './transactions.page';
import { AddIncomePage } from './add-income/add-income.page';
import { AddExpensePage } from './add-expense/add-expense.page';
import { DetailPage } from './detail/detail.page';


const routes: Routes = [
  {
    path: '',
    component: TransactionsPage
  },
  { path: 'income', component: AddIncomePage },
  { path: ':id/income', component: AddIncomePage },
  { path: 'expense', component: AddExpensePage },
  { path: ':id/expense', component: AddExpensePage },
  { path: ':id/detail', component: DetailPage },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
