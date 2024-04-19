import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRevenueComponent } from './approved-revenue.component';

describe('ApprovedRevenueComponent', () => {
  let component: ApprovedRevenueComponent;
  let fixture: ComponentFixture<ApprovedRevenueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedRevenueComponent]
    });
    fixture = TestBed.createComponent(ApprovedRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
