import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Budget } from '../models/budget';
import { ApiService } from './api.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private api: ApiService) {
  }

  getbudgets(): Promise<Budget[]> {
    return this.api.db.executeSql(`SELECT budgetId,name,note,startDate,endDate FROM budgets`, []).then((data) => {
      let lenCats = data.rows.length;
      let list: Budget[] = new Array();
      for (let i = 0; i < lenCats; i++) {
        let item: any = data.rows.item(i);
        console.log(item);
        let model: Budget = {
          budgetId: item.budgetId,
          name: item.name,
          endDate: item.endDate,
          note: item.note,
          startDate: item.startDate
        };
        list.push(model);
      }
      return list;
    });
  }

  getBudgetCounts(): Promise<number> {
    return this.api.db.executeSql(`SELECT COUNT(*) AS count FROM budgets`, []).then((data) => {
      let item: any = data.rows.item(0);
      let count = (<number>item.count) || 0;
      return count;
    });
  }

  /* getCurrentBudget(startDate?: any, endDate?: any): Promise<Budget> {
     if (startDate == null) {
       startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
     }
     if (endDate == null) {
       endDate = moment(new Date()).endOf('month').format('YYYY-MM-DD');
     }
     return this.api.db.executeSql(`SELECT budgetId,note,startDate,endDate FROM budgets 
     WHERE startDate >= ? and endDate <= ?`, [startDate, endDate]).then((data) => {
         let lenCats = data.res.rows.length;
         let list: Budget[] = new Array();
         for (let i = 0; i < lenCats; i++) {
           let item: any = data.res.rows(i);
           let model: Budget = {
             budgetId: item.budgetId,
             endDate: item.endDate,
             note: item.note,
             startDate: item.startDate
           };
           list.push(model);
         }
         return list;
       });
   }
 */
  getBudget(id: number): Promise<Budget> {
    return this.api.db.executeSql('SELECT budgetId,note,name,startDate,endDate FROM budgets WHERE budgetId=?', [id]).then((data) => {
      let model: Budget;
      if (data.res.length > 0) {
        let item: any = data.rows.item(0);
        model.budgetId = item.budgetId;
        model.name = item.name;
        model.note = item.note;
        model.startDate = item.startDate;
        model.endDate = item.endDate;
      }
      return model;
    });
  }

  getLastBudget() {
    return this.api.db.executeSql('SELECT * FROM budgets ORDER BY budgetId DESC LIMIT 1', []).then((data) => {
      let model: Budget;
      if (data.rows.length > 0) {
        let item: any = data.rows.item(0);
        model.budgetId = item.budgetId;
        model.name = item.name;
        model.note = item.note;
        model.startDate = item.startDate;
        model.endDate = item.endDate;
      }
      return model;
    });
  }

  saveBudget(budget: Budget): Promise<Budget> {
    if (budget.budgetId > 0) {
      return this.api.db.executeSql(`UPDATE budgets SET name=?, note=?,startDate=?,endDate=? WHERE budgetId=?`,
        [budget.name, budget.note, budget.startDate, budget.endDate])
        .then(async res => {
          return budget;
        });
    } else {
      return this.api.db.executeSql(`INSERT INTO budgets(budgetId,name,note,startDate,endDate) VALUES(NULL,?,?,?,?)`,
        [budget.name, budget.note, budget.startDate, budget.endDate])
        .then(async res => {
          return budget;
        });
    }
  }
}
