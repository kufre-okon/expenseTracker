import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { ExpenseTypeEnum } from '../models/expense-enum';
import { IdNamePair } from '../models/idnamepair';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  db: SQLiteObject;
  private isOpen: boolean;

  constructor(private storage: SQLite) {
  //  console.log("Am called...");
    this.initData();
  }

  getTimeFormats(): Promise<IdNamePair[]> {
    return this.db.executeSql(`SELECT formatId,name FROM timeFormats`, []).then((data) => {
      // console.log(data);
      let lenCats = data.rows.length;
      let list: IdNamePair[] = new Array<IdNamePair>();
      for (let i = 0; i < lenCats; i++) {
        let item: any = data.rows.item(i);
        if (item) {
          let model = {
            Id: item.formatId,
            Name: item.name
          };
          list.push(model);
        }
      }
      return list;
    });
  }

  getDateFormats(): Promise<IdNamePair[]> {
    return this.db.executeSql(`SELECT formatId,name FROM dateFormats`, []).then((data) => {
      // console.log(data);
      let lenCats = data.rows.length;
      let list: IdNamePair[] = new Array<IdNamePair>();
      for (let i = 0; i < lenCats; i++) {
        let item: any = data.rows.item(i);
        if (item) {
          let model = {
            Id: item.formatId,
            Name: item.name
          };
          list.push(model);
        }
      }
      return list;
    });
  }


  private initData() {
    this.openConnection().then(() => {
      this.createTimeFormatTable();
    }).catch((error) => {
      console.error("Init-Data=>", error);
    });
  }

  private openConnection(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.isOpen) {
        this.storage = new SQLite();
        this.storage.create({ name: 'expensetracker.db', location: 'default' }).then((db: SQLiteObject) => {
          this.db = db;
          this.isOpen = true;
          resolve(null);
        }).catch((error) => {
          console.error("Open-Connection=>", error);
          reject(error);
        });
      } else {
        resolve(null);
      }
    });
  }

  private createTimeFormatTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS timeFormats(formatId INTEGER PRIMARY KEY,name VARCHAR(55))`, []).then(() => {
      this.createDateFormatTable();
    }).catch((error) => {
      console.error("Create-Table-timeFormats=>", error);
    });
  }

  private createDateFormatTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS dateFormats(formatId INTEGER PRIMARY KEY,name VARCHAR(55))`, []).then(() => {
      this.createSettingsTable();
    }).catch((error) => {
      console.error("Create-Table-dateFormats=>", error);
    });
  }

  private createSettingsTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS settings(
      settingId INTEGER PRIMARY KEY,
      currencySymbol TEXT,
      dateFormatId INTEGER NOT NULL,
      timeFormatId INTEGER NOT NULL,
      enableLock BOOLEAN NOT NULL,
      enableDailyReminderNotification BOOLEAN NOT NULL,
      pinCode TEXT NULL,
      FOREIGN KEY(dateFormatId) REFERENCES DateFormats(formatId),
      FOREIGN KEY(timeFormatId) REFERENCES TimeFormats(formatId))`, []).then(() => {
        this.createCategoryTable();
      }).catch((error) => {
        console.error("Create-Table-settings=>", error);
      });
  }

  private createCategoryTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS categories(
    categoryId INTEGER PRIMARY KEY,
    name VARCHAR(255),
    type INTEGER NOT NULL)`, []).then(() => {
        this.createBudgetTable();
      }).catch((error) => {
        console.error("Create-Table-categories=>", error);
      });
  }

  private createBudgetTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS budgets(
      budgetId INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      note TEXT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL)`, []).then(() => {
        this.createAccountTable();
      }).catch((error) => {
        console.error("Create-Table-budgets=>", error);
      });
  }

  private createAccountTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS accounts(
      accountId INTEGER PRIMARY KEY,
      name VARCHAR(255),
      initialBalance DECIMAL NULL,
      initialDate DATETIME NULL,
      note TEXT NULL)`, []).then(() => {
        this.createRecurrentExpensesTable();
      }).catch((error) => {
        console.error("Create-Table-accounts=>", error);
      });
  }

  private createRecurrentExpensesTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS recurrentExpenses(
      recurrentId INTEGER PRIMARY KEY,
      isActive BOOLEAN NOT NULL,
      frequency INTEGER NULL,
      interval INTEGER NULL,
      duration INTEGER NULL)`, []).then(() => {
        this.createTexpensesTable();
      }).catch((error) => {
        console.error("Create-Table-recurrentExpenses=>", error);
      });
  }

  private createTexpensesTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS expenses(
      expenseId INTEGER PRIMARY KEY,
      categoryId INTEGER NOT NULL,
      accountId INTEGER NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      date DATETIME NOT NULL,
      isRecurrent BOOLEAN NOT NULL,
      recurrentId INTEGER NULL,
      budgetId INTEGER NOT NULL,
      FOREIGN KEY(budgetId) REFERENCES budgets(budgetId),
      FOREIGN KEY(recurrentId) REFERENCES recurrentExpenses(recurrentId),
      FOREIGN KEY(categoryId) REFERENCES categories(categoryId),
      FOREIGN KEY(accountId) REFERENCES accounts(accountId))`, []).then(() => {
        this.createIncomeTable();
      }).catch((error) => {
        console.error("Create-Table-expenses=>", error);
      });
  }

  private createIncomeTable(): any {
    this.db.executeSql(`CREATE TABLE IF NOT EXISTS incomes(
      incomeId INTEGER PRIMARY KEY,
      categoryId INTEGER NOT NULL,
      accountId INTEGER NOT NULL,
      description TEXT,
      comment TEXT,
      amount REAL NOT NULL,
      date DATETIME NOT NULL,
      isRecurrent BOOLEAN NOT NULL,
      recurrentId INTEGER NULL,
      budgetId INTEGER NOT NULL,
      FOREIGN KEY(budgetId) REFERENCES budgets(budgetId),
      FOREIGN KEY(recurrentId) REFERENCES recurrentExpenses(recurrentId),
      FOREIGN KEY(categoryId) REFERENCES categories(categoryId),
      FOREIGN KEY(accountId) REFERENCES accounts(accountId))`, []).then(() => {
        this.seedTimeFormats();
        this.seedDateFormats();
        this.seedDefaultCategories();
        this.seedSettings();
      }).catch((error) => {
        console.error("Create-Table-incomes=>", error);
      });
  }

  private seedTimeFormats(): any {
    const timeFormats = [
      "hh:mm A",
      "HH:mm"
    ];
    this.db.executeSql('SELECT * FROM timeFormats', [])
      .then(res => {
        if (res.rows.length < 1) {
          timeFormats.forEach((val) => {
            this.db.executeSql('INSERT INTO timeFormats VALUES(NULL,?)', [val])
              .catch(e => console.log(e));
          });
        }
      })
      .catch(e => console.log(e));
  }

  private seedDateFormats(): any {
    const dateFormats = [
      "DD/MM/YYYY",
      "MM/DD/YYYY",
      "DD MMM,YYYY",
      "MMM DD, YYYY",
      "YYYY/MM/DD",
      "YYYY/DD/MM"
    ];
    this.db.executeSql('SELECT * FROM DateFormats', [])
      .then(res => {
        if (res.rows.length < 1) {
          dateFormats.forEach((val) => {
            this.db.executeSql('INSERT INTO DateFormats VALUES(NULL,?)', [val])
              .catch(e => console.log(e));
          });
        }
      })
      .catch(e => console.log(e));
  }

  private seedSettings(): any {
    this.db.executeSql('SELECT * FROM settings', [])
      .then(res => {
        if (res.rows.length < 1) {
          this.db.executeSql(`INSERT INTO settings (settingId,currencySymbol,dateFormatId,timeFormatId,
            enableLock,enableDailyReminderNotification,pinCode) VALUES(NULL,?,?,?,?,?,?)`, ['$', 1, 1, false, false, null])
            .then(() => {
             // this.runtime.loadSettings(this);
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }

  private seedDefaultCategories(): any {
    const expenseCats = ["Clothing", "Drinks", "Education", "Food", "Fuel", "Fund",
      "Hotel", "Medical", "Personal", "Transport", "Shopping", "Repairs", "Other"];
    const incomeCats = ["Business", "Loan", "Salary"];

    this.db.executeSql('SELECT * FROM categories', [])
      .then(res => {
        if (res.rows.length < 1) {
          expenseCats.forEach((val) => {
            this.db.executeSql('INSERT INTO categories VALUES(NULL,?,?)', [val, ExpenseTypeEnum.Expense])
              .catch(e => console.log(e));
          });
          incomeCats.forEach((val) => {
            this.db.executeSql('INSERT INTO categories VALUES(NULL,?,?)', [val, ExpenseTypeEnum.Income])
              .catch(e => console.log(e));
          });
        }
      })
      .catch(e => console.log(e));
  }


}
