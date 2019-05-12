import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountsPage } from './accounts.page';
import { AddEditAccountPage } from './add-edit-account/add-edit-account.page';
import { AccountsRoutingModule } from './accounts-routing.module';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { SharedModule } from '../../shared/shared-module/shared.module';
import { AccountDetailPage } from './account-detail/account-detail.page';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    AccountsRoutingModule,
    Ionic4DatepickerModule,
    SharedModule
  ],
  declarations: [
    AccountsPage,
    AddEditAccountPage,
    AccountDetailPage
  ]
})
export class AccountsPageModule { }
