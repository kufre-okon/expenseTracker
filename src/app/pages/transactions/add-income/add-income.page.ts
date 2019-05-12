import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../../services/budget.service';
import { AlertService } from '../../../services/alert.service';
import { NavController, ModalController } from '@ionic/angular';
import { AddBudgetModalComponent } from '../../../shared/components/add-budget-modal/add-budget-modal.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.page.html',
  styleUrls: ['./add-income.page.scss'],
})
export class AddIncomePage implements OnInit {

  constructor(private budServ: BudgetService,
    private alertServ: AlertService,
    public modalContrl: ModalController,
    private location: Location
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.checkBudgetExistence();
  }

  checkBudgetExistence() {
    this.budServ.getBudgetCounts().then(async data => {
      if (data < 1) {
        await this.alertServ.presentOkAlert('No Budget Configured!',
          'Please configure budget to post transactions.', null, async (resp) => {
            const modal = await this.modalContrl.create({
              component: AddBudgetModalComponent,
              backdropDismiss: false
            });
            await modal.present();
            modal.onDidDismiss().then((result) => {
              let modalData = result.data;
              // check if the modal was simply dismissed by the user and
              // return back to the previous page since we can't create any transaction at
              // this stage
              if (modalData && modalData.cancelled) {
                this.location.back();
              }
            });
          });
      }
    });
  }


}
