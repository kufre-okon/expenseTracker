import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  getMenus(): any[] {
    const menus = [
      {
        title: 'Home',
        url: '/home',
        icon: 'home',
        hasSeparator: false
      },
      {
        title: 'Accounts',
        url: '/accounts',
        icon: 'folder-open',
        hasSeparator: false
      },
      {
        title: 'Budgets',
        url: '/budgets',
        icon: 'list',
        hasSeparator: false
      },
      {
        title: 'My Transactions',
        url: '/transactions',
        icon: 'cash',
        hasSeparator: false
      },
      {
        title: 'Recurring Transactions',
        url: '/recurringtransaction',
        icon: 'repeat',
        hasSeparator: false
      },
      {
        title: 'Category',
        url: '/category',
        icon: 'filing',
        hasSeparator: true
      },
      {
        title: 'Setting',
        url: '/setting',
        icon: 'settings',
        hasSeparator: true
      }
    ];
    return menus;
  }
}
