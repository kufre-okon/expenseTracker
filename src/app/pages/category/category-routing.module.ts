import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPage } from './category.page';
import { AddCategoryPage } from './add-category/add-category.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage
  },
  { path: 'add', component: AddCategoryPage },
  { path: ':id', component: AddCategoryPage }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
