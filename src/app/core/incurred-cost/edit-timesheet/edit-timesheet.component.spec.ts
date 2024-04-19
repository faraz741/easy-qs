import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimesheetComponent } from './edit-timesheet.component';

describe('EditTimesheetComponent', () => {
  let component: EditTimesheetComponent;
  let fixture: ComponentFixture<EditTimesheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTimesheetComponent]
    });
    fixture = TestBed.createComponent(EditTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
