import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecurringtransactionPage } from './recurringtransaction.page';

const routes: Routes = [
  {
    path: '',
    component: RecurringtransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecurringtransactionPage]
})
export class RecurringtransactionPageModule {}
