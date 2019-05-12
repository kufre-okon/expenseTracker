import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { IdNamePair } from '../models/idnamepair';
import { ExpenseTypeEnum } from '../models/expense-enum';
import { Category } from '../models/category';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private api: ApiService) {
  }

  getExpenseCategories(): Promise<Category[]> {
    return this.getCategories(ExpenseTypeEnum.Expense);
  }

  getIncomeCategories(): Promise<Category[]> {
    return this.getCategories(ExpenseTypeEnum.Income);
  }

  getCategory(id: number): Promise<Category> {
    return this.api.db.executeSql('SELECT categoryId,name,type FROM categories WHERE categoryId=?', [id]).then((data) => {
      let item: any = data.rows.item(0);
      let model: Category = {
        id: item.categoryId,
        name: item.name,
        type: item.type
      };
      return model;
    });
  }

  saveCategory(category: Category): Promise<Category> {
    if (category.id > 0) {
      return this.api.db.executeSql('UPDATE categories SET name=?,type=? WHERE categoryId=?', [category.name, category.type, category.id])
        .then(async res => {
          return category;
        });
    } else {
      return this.api.db.executeSql('INSERT INTO categories(categoryId,name,type) VALUES(NULL,?,?)', [category.name, category.type])
        .then(async res => {
          return category;
        });
    }
  }


  private getCategories(type: number): Promise<Category[]> {
    return this.api.db.executeSql('SELECT categoryId, name,type FROM categories WHERE type=?', [type]).then((data) => {
      let lenCats = data.rows.length;
      let list: Category[] = new Array();
      for (let i = 0; i < lenCats; i++) {
        let item: any = data.rows.item(i);
        let model: Category = {
          id: item.categoryId,
          name: item.name,
          type: item.type
        };
        list.push(model);
      }
      return list;
    });
  }
}
