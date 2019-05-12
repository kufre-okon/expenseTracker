import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrls: ['./nav-links.component.scss'],
})
export class NavLinksComponent implements OnInit {

  constructor(private router: Router,
    public viewCtrl: PopoverController 
  ) { }

  ngOnInit() { }

  close() {
    this.viewCtrl.dismiss();
  }

  addExpense() {
    this.close();
    this.router.navigate(['transactions/expense']);
  }

  addIncome() {
    this.close();
    this.router.navigate(['transactions/income']);
  }
}
