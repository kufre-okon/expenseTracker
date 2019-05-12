import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './pages/list/list.module#ListPageModule'
  },
  {
    path: 'setting',
    loadChildren: './pages/setting/setting.module#SettingPageModule'
  },
  {
    path: 'budgets',
    loadChildren: './pages/budgets/budgets.module#BudgetsPageModule'
  },
  {
    path: 'transactions',
    loadChildren: './pages/transactions/transactions.module#TransactionsPageModule'
  },
  {
    path: 'recurringtransaction',
    loadChildren: './pages/recurringtransaction/recurringtransaction.module#RecurringtransactionPageModule'
  },
  {
    path: 'category',
    loadChildren: './pages/category/category.module#CategoryPageModule'
  },
  {
    path: 'accounts',
    loadChildren: './pages/accounts/accounts.module#AccountsPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
