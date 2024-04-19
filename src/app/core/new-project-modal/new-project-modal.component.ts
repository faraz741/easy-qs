import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';
import { AllProjectComponent } from '../all-project/all-project.component';

@Component({
  selector: 'app-new-project-modal',
  templateUrl: './new-project-modal.component.html',
  styleUrls: ['./new-project-modal.component.css']
})
export class NewProjectModalComponent {

  newForm!: FormGroup
  @ViewChild('closeModal') closeModal!: ElementRef;

  readonly MAX_DATE = new Date();

  constructor(private route: Router, private srevice: CoreService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.newForm = new FormGroup({
      project_name: new FormControl('', Validators.required),
      project_address: new FormControl('', Validators.required),
      project_startdate: new FormControl('', Validators.required),
      project_completiondate: new FormControl('', [Validators.required])
    })
  }

  endDateAfterStartDateValidator() {
    return (controls: { value: string | number | Date; }) => {
      const startDate = new Date(this.newForm.get('project_startdate')?.value);
      const endDate = new Date(controls.value);
      if (endDate < startDate) {
        return { endDateBeforeStartDate: true };
      }
      return null;
    };
  }

  // isEndDateDisabled() {
  //   const startDate = this.newForm.get('project_startdate')?.value;
  //   return !startDate || this.newForm.controls['project_completiondate']?.errors['endDateBeforeStartDate'];
  // }

  isEndDateDisabled() {
    const startDate = this.newForm.get('project_startdate')?.value;
    return !startDate;
  }


  onSubmit() {
    this.newForm.markAllAsTouched();
    // this.closeModal.nativeElement.click();
    // this.route.navigateByUrl('/core/main/dashboard')
    if (this.newForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('project_name', this.newForm.value.project_name)
      formURlData.set('project_address', this.newForm.value.project_address)
      formURlData.set('project_startdate', this.newForm.value.project_startdate)
      formURlData.set('project_completiondate', this.newForm.value.project_completiondate)
      console.log(formURlData.toString());
      this.srevice.addProject(formURlData.toString()).subscribe({
        next: resp => {
          if (resp.success === true) {
            this.newForm.reset();
            this.closeModal.nativeElement.click();
            this.toastr.success('Project added successfully!');
            // localStorage.setItem('projectDetails', JSON.stringify(formURlData.toString()))
            // this.route.navigate(['/core/main/dashboard', formURlData.toString()]);
            //this.route.navigateByUrl("/core/main/dashboard")
            this.route.navigateByUrl("/core/admin/all-project")
            //this.all.getAllProject()
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: error => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message)
        }
      });
    }
  }

}
