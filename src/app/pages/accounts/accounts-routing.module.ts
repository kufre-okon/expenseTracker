import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsPage } from './accounts.page';
import { AddEditAccountPage } from './add-edit-account/add-edit-account.page';
import { AccountDetailPage } from './account-detail/account-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AccountsPage
  },
  { path: 'add', component: AddEditAccountPage },
  { path: ':id', component: AddEditAccountPage },
  { path: ':id/detail', component: AccountDetailPage }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
