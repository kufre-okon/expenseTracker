import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavLinksComponent } from './nav-links/nav-links.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  constructor(
    public popoverController: PopoverController
  ) {
    
   }

  ngOnInit() {
  }

  async showNavLinks(ev: any) {
    const popover = await this.popoverController.create({
      component: NavLinksComponent,
      event: ev,
     // translucent: true,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }
}
