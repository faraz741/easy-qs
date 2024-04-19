import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncurredCostComponent } from './incurred-cost.component';

describe('IncurredCostComponent', () => {
  let component: IncurredCostComponent;
  let fixture: ComponentFixture<IncurredCostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncurredCostComponent]
    });
    fixture = TestBed.createComponent(IncurredCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
