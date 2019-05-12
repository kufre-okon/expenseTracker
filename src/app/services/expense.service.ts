import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Expense } from '../models/expense';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private api: ApiService) {

  }

  getExpenses(accountId: number, startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.api.db.executeSql(`SELECT expenseId,categoryId, accountId,description, amount,date,
      isRecurrent,recurrentId,budgetId FROM expenses
      WHERE accountId=? AND (date>=? AND date<=?)`, [accountId, startDate, endDate]).then((data) => {
        let lenCats = data.res.rows.length;
        let list: Expense[] = new Array(lenCats);
        for (let i = 0; i < lenCats; i++) {
          let item: any = data.res.rows(i);
          let model: Expense = {
            expenseId: item.expenseId,
            categoryId: item.categoryId,
            accountId: item.accountId,
            description: item.description,
            amount: item.amount,
            date: item.date,
            isRecurrent: item.isRecurrent,
            recurrentId: item.recurrentId,
            budgetId: item.budgetId
          };
          list.push(model);
        }
        return list;
      });
  }

  getRecurrentExpenses(accountId: number): Promise<Expense[]> {
    return this.api.db.executeSql(`SELECT expenseId,categoryId, accountId,description, amount,date,
      isRecurrent,recurrentId,budgetId FROM expenses
      WHERE accountId=? AND isRecurrent=1`, [accountId]).then((data) => {
        let lenCats = data.res.rows.length;
        let list: Expense[] = new Array(lenCats);
        for (let i = 0; i < lenCats; i++) {
          let item: any = data.res.rows(i);
          let model: Expense = {
            expenseId: item.expenseId,
            categoryId: item.categoryId,
            accountId: item.accountId,
            description: item.description,
            amount: item.amount,
            date: item.date,
            isRecurrent: item.isRecurrent,
            recurrentId: item.recurrentId,
            budgetId: item.budgetId
          };
          list.push(model);
        }
        return list;
      });
  }

  getTotalExpenses(accountId: number, startDate: Date, endDate: Date): Promise<number> {
    return this.api.db.executeSql(`SELECT SUM(amount) AS totalAmount FROM expenses
       WHERE accountId=? AND (date>=? AND date<=?)`, [accountId, startDate, endDate]).then((data) => {
        let len = data.res.rows.length;
        let amount = 0.0;
        if (len > 0)
          amount = parseFloat(data.res.rows(0).totalAmount);
        return amount;
      });
  }

  getExpense(id: number): Promise<Expense> {
    return this.api.db.executeSql(`SELECT expenseId,categoryId, accountId,description, amount,date,
    isRecurrent,recurrentId,budgetId FROM expenses WHERE expenseId=?`, [id]).then((data) => {
        let model: Expense;
        if (data.res.rows.length > 0) {
          let item: any = data.res.rows(0);
          model = {
            expenseId: item.expenseId,
            categoryId: item.categoryId,
            accountId: item.accountId,
            description: item.description,
            amount: item.amount,
            date: item.date,
            isRecurrent: item.isRecurrent,
            recurrentId: item.recurrentId,
            budgetId: item.budgetId
          };
        }
        return model;
      });
  }

  saveExpense(expense: Expense): Promise<Expense> {
    if (expense.expenseId > 0) {
      return this.api.db.executeSql(`UPDATE expenses SET categoryId=?,accountId=?,description=?,amount=?,date=?,
      isRecurrent=?,recurrentId=?,budgetId=? WHERE expenseId=?`,
        [expense.categoryId, expense.accountId, expense.description, expense.amount, expense.date,
        expense.isRecurrent, expense.recurrentId, expense.budgetId, expense.expenseId])
        .then(async res => {
          return expense;
        });
    } else {
      return this.api.db.executeSql(`INSERT INTO expenses(expenseId,categoryId,accountId,description,amount,date,
        isRecurrent,budgetId,recurrentId) VALUES(NULL,?,?,?,?,?,?,?,?)`,
        [expense.categoryId, expense.accountId, expense.description, expense.amount, expense.date,
        expense.isRecurrent, expense.budgetId, expense.recurrentId])
        .then(async res => {
          return expense;
        });
    }
  }
}
