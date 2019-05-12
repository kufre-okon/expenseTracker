import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ExpenseTypeEnum } from '../../../models/expense-enum';
import { AlertService } from '../../../services/alert.service';
import { LoaderService } from '../../../services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {

  attemptedSaved = false;
  categoryForm: FormGroup;
  title = "New Category";
  selectedType: any = 1;

  catTypes = [{ id: 1, name: 'Expense' }, { id: 2, name: 'Income' }];

  validation_messages = {
    'name': [
      { type: 'required', message: 'Category name is required.' },
      { type: 'maxlength', message: 'Category name cannot be more than 200 characters long.' },
    ],
    'type': [
      { type: 'required', message: 'Category type is required.' }
    ]
  };

  constructor(private alertServ: AlertService,
    private catServ: CategoryService,
    public fb: FormBuilder, private loader: LoaderService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedType = this.router.getCurrentNavigation().extras.state.type;
      }
      // build form after category type has been gotten from route
      this.buildForm();
    });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.title = "Edit Category";
      this.getCategory(id);
    }
  }

  buildForm() {
    this.categoryForm = this.fb.group({
      id: new FormControl({ value: null, disabled: true }),
      name: new FormControl('', Validators.compose([Validators.maxLength(200), Validators.required])),
      type: new FormControl(this.selectedType, Validators.required),
    });
  }

  getCategory(id: any) {
    this.catServ.getCategory(id).then((data) => {
      this.categoryForm.patchValue({
        id: data.id,
        name: data.name,
        type: data.type
      });
    }).catch((err) => {
      this.alertServ.presentOkAlert('Error', err);
    });
  }

  // convenient way of getting form controls
  get form() { return this.categoryForm.controls; }

  save() {
    this.attemptedSaved = true;
    if (this.categoryForm.valid) {
      this.loader.create().then((inst) => {
        var form = <Category>this.categoryForm.getRawValue();
        this.catServ.saveCategory(form).then((resp) => {
          inst.dismiss();
          this.alertServ.presentOkAlert('Success', 'Category saved.').then(() => {
            this.navCtrl.back();
          });
        }).catch(err => {
          this.alertServ.presentOkAlert('Error', err);
          inst.dismiss();
        });
      });
    }
  }
}
