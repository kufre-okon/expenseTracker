import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Income } from '../models/income';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class IncomeService {

  constructor(private api: ApiService) {
  }

  getIncomes(accountId: number, startDate: Date, endDate: Date): Promise<Income[]> {
    return this.api.db.executeSql(`SELECT incomeId,categoryId, accountId,description, amount,date,
        isRecurrent,recurrentId,budgetId,comment FROM incomes
       WHERE accountId=? AND (date>=? AND date<=?)`, [accountId, startDate, endDate]).then((data) => {
        let lenCats = data.res.rows.length;
        let list: Income[] = new Array(lenCats);
        for (let i = 0; i < lenCats; i++) {
          let item: any = data.res.rows(i);
          let model: Income = {
            incomeId: item.incomeId,
            categoryId: item.categoryId,
            accountId: item.accountId,
            description: item.description,
            amount: item.amount,
            date: item.date,
            isRecurrent: item.isRecurrent,
            recurrentId: item.recurrentId,
            budgetId: item.budgetId,
            comment: item.comment
          };
          list.push(model);
        }
        return list;
      });
  }

  getTotalIncomes(accountId: number, startDate: Date, endDate: Date): Promise<number> {
    return this.api.db.executeSql(`SELECT SUM(amount) AS totalAmount FROM incomes
       WHERE accountId=? AND (date>=? AND date<=?)`, [accountId, startDate, endDate]).then((data) => {
        let len = data.res.rows.length;
        let amount = 0.0;
        if (len > 0)
          amount = parseFloat(data.res.rows(0).totalAmount);
        return amount;
      });
  }

  getRecurrentIncomes(accountId: number): Promise<Income[]> {
    return this.api.db.executeSql(`SELECT incomeId,categoryId, accountId,description, amount,date,
        isRecurrent,recurrentId,budgetId,comment FROM incomes
       WHERE accountId=? AND isRecurrent=1`, [accountId]).then((data) => {
        let lenCats = data.res.rows.length;
        let list: Income[] = new Array(lenCats);
        for (let i = 0; i < lenCats; i++) {
          let item: any = data.res.rows(i);
          let model: Income = {
            incomeId: item.incomeId,
            categoryId: item.categoryId,
            accountId: item.accountId,
            description: item.description,
            amount: item.amount,
            date: item.date,
            isRecurrent: item.isRecurrent,
            recurrentId: item.recurrentId,
            budgetId: item.budgetId,
            comment: item.comment
          };
          list.push(model);
        }
        return list;
      });
  }

  getIncome(id: number): Promise<Income> {
    return this.api.db.executeSql(`SELECT incomeId,categoryId, accountId,description, amount,date,
      isRecurrent,recurrentId,budgetId,comment FROM incomes WHERE incomeId=?`, [id]).then((data) => {
        let model: Income;
        if (data.res.rows.length > 0) {
          let item: any = data.res.rows(0);
          model = {
            incomeId: item.incomeId,
            categoryId: item.categoryId,
            accountId: item.accountId,
            description: item.description,
            amount: item.amount,
            date: item.date,
            isRecurrent: item.isRecurrent,
            recurrentId: item.recurrentId,
            budgetId: item.budgetId,
            comment: item.comment
          };
        }
        return model;
      });
  }

  saveIncome(income: Income): Promise<Income> {
    if (income.incomeId > 0) {
      return this.api.db.executeSql(`UPDATE incomes SET categoryId=?,accountId=?,description=?,amount=?,date=?,
        isRecurrent=?,recurrentDate=?,frequency=?,interval=?,duration=?,budgetId=?,comment=? WHERE incomeId=?`,
        [income.categoryId, income.accountId, income.description, income.amount, income.date, income.isRecurrent,
        income.recurrentId, income.budgetId, income.comment, income.incomeId])
        .then(async res => {
          return income;
        });
    } else {
      return this.api.db.executeSql(`INSERT INTO incomes(incomeId,categoryId,accountId,description,amount,date,
          isRecurrent,recurrentId,frequency,interval,duration,budgetId,comment) VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [income.categoryId, income.accountId, income.description, income.amount, income.date, income.isRecurrent,
        income.recurrentId, income.budgetId, income.comment])
        .then(async res => {
          return income;
        });
    }
  }
}
