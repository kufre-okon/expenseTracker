import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BudgetPage } from './budgets.page';
import { AddBudgetPage } from './add-budget/add-budget.page';
import { BudgetRoutingModule } from './budget-routing.module';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    BudgetRoutingModule
  ],
  declarations: [
    BudgetPage,
    AddBudgetPage
  ]
})
export class BudgetsPageModule { }
