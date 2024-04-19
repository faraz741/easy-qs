import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.css']
})
export class ProjectTeamComponent {

  newForm!: FormGroup
  @ViewChild('closeModal') closeModal!: ElementRef;
  data: any[] = [];
  searchQuery = '';
  projectDet: any;
  projectId: any;

  constructor(private service: CoreService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.getSupplyData()
  }

  initForm() {
    this.projectDet = localStorage.getItem('projectDetails');
    const parsedData = JSON.parse(this.projectDet);
    this.projectId = parsedData['id']
    
    this.newForm = new FormGroup({
      name: new FormControl('', Validators.required),
      job_role: new FormControl('', Validators.required),
      contact_no: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required)
    })
  }

  getSupplyData() {
    this.service.getSupplyChain().subscribe({
      next: resp => {
        this.data = resp.supplychainDetails;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  onSubmit() {
    this.newForm.markAllAsTouched();
    if (this.newForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('name', this.newForm.value.name)
      formURlData.set('job_role', this.newForm.value.job_role)
      formURlData.set('contact_no', this.newForm.value.contact_no)
      formURlData.set('city', this.newForm.value.city)
      formURlData.set('project_id', this.projectId)
      this.service.addProjectTeam(formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.toastr.success(resp.message);
            this.closeModal.nativeElement.click();
          }
          else{
            this.toastr.warning(resp.message);
          }
          this.newForm.reset();
          
          this.getSupplyData()
        },
        error: error => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message)
        }
      })
    }
  }

}
