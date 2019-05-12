import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { AccountModel } from '../models/account';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private api: ApiService) {

  }

  getAccounts(): Promise<AccountModel[]> {
    return this.api.db.executeSql(`SELECT accountId, name,initialBalance, initialDate, note FROM accounts`, []).then((data) => {
      let lenCats = data.rows.length;
      let list: AccountModel[] = new Array();
      for (let i = 0; i < lenCats; i++) {
        let item: any = data.rows.item(i);
        let model: AccountModel = {
          accountId: item.accountId,
          name: item.name,
          initialBalance: item.initialBalance,
          initialDate: item.initialDate,
          note: item.note
        };
        list.push(model);
      }
      return list;
    });
  }

  getAccount(id: number): Promise<AccountModel> {
    return this.api.db.executeSql('SELECT accountId,name,initialBalance,initialDate,note FROM accounts WHERE accountId=?', [id]).then((data) => {
      let model: AccountModel;
      if (data.rows.length > 0) {
        let item: any = data.rows.item(0);
        model = {
          accountId: item.accountId,
          name: item.name,
          initialBalance: item.initialBalance,
          initialDate: item.initialDate,
          note: item.note
        };
      }
      return model;
    });
  }

  saveAccount(account: AccountModel): Promise<AccountModel> {
    if (account.accountId > 0) {
      return this.api.db.executeSql(`UPDATE accounts SET name=?,note=?,initialBalance=?,initialDate=? WHERE accountId=?`,
        [account.name, account.note, account.initialBalance, account.initialDate, account.accountId])
        .then(async res => {
          return account;
        });
    } else {
      return this.api.db.executeSql(`INSERT INTO accounts(accountId,name,note,initialBalance,initialDate) VALUES(NULL,?,?,?,?)`,
        [account.name, account.note, account.initialBalance, account.initialDate])
        .then(async res => {
          return account;
        });
    }
  }
}
