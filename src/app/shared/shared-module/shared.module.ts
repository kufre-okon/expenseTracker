import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FancyBadgeComponent } from '../components/fancy-badge/fancy-badge.component';
import { AddBudgetModalComponent } from '../components/add-budget-modal/add-budget-modal.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

@NgModule({
  declarations: [
    FancyBadgeComponent,
    AddBudgetModalComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    Ionic4DatepickerModule,
  ],
  entryComponents: [
    AddBudgetModalComponent
  ],
  exports: [
    FancyBadgeComponent
  ]
})
export class SharedModule { }
