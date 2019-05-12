import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CategoryRoutingModule } from './category-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryPage } from './category.page';
import { FancyBadgeComponent } from '../../shared/components/fancy-badge/fancy-badge.component';
import { AddCategoryPage } from './add-category/add-category.page';
import { SharedModule } from '../../shared/shared-module/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CategoryRoutingModule,
    SharedModule
  ],
  declarations: [
    CategoryPage,
    AddCategoryPage
  ]
})
export class CategoryPageModule { }
