import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportsComponent } from './financial-reports.component';

describe('FinancialReportsComponent', () => {
  let component: FinancialReportsComponent;
  let fixture: ComponentFixture<FinancialReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
