import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringtransactionPage } from './recurringtransaction.page';

describe('RecurringtransactionPage', () => {
  let component: RecurringtransactionPage;
  let fixture: ComponentFixture<RecurringtransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringtransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringtransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
