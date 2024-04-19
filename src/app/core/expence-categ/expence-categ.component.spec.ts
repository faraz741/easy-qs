import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceCategComponent } from './expence-categ.component';

describe('ExpenceCategComponent', () => {
  let component: ExpenceCategComponent;
  let fixture: ComponentFixture<ExpenceCategComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenceCategComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceCategComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
