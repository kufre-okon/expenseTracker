import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetPage } from './budgets.page';
import { AddBudgetPage } from './add-budget/add-budget.page';


const routes: Routes = [
  {
    path: '',
    component: BudgetPage
  },
  { path: 'add', component: AddBudgetPage },
  { path: ':id', component: AddBudgetPage },
  { path: ':id/detail', component: AddBudgetPage }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
