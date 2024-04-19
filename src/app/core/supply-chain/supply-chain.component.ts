import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-supply-chain',
  templateUrl: './supply-chain.component.html',
  styleUrls: ['./supply-chain.component.css']
})
export class SupplyChainComponent implements OnInit {

  newForm!: FormGroup
  @ViewChild('closeModal') closeModal!: ElementRef;

  data: any[] = []; // Your table data
  filteredData: any[] = [];
  searchQuery = '';

  constructor(private route: Router, private service: CoreService, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.initForm();
    this.getSupplyData()
  }

  getSupplyData() {
    //this.closeModal.nativeElement.click();
    this.service.getSupplyChain().subscribe({
      next: resp => {
        this.data = resp.supplychainDetails;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  initForm() {
    this.newForm = new FormGroup({
      company_name: new FormControl('', Validators.required),
      company_description: new FormControl('', Validators.required),
      company_email: new FormControl('', [Validators.required, Validators.email]),
      company_contact: new FormControl('', Validators.required),
      company_city: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    this.newForm.markAllAsTouched();
    if (this.newForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('company_name', this.newForm.value.company_name)
      formURlData.set('company_description', this.newForm.value.company_description)
      formURlData.set('company_email', this.newForm.value.company_email)
      formURlData.set('company_contact', this.newForm.value.company_contact)
      formURlData.set('company_city', this.newForm.value.company_city)
      this.service.addSupplyChain(formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.toastr.success('Supply chain added successfully!');
            this.closeModal.nativeElement.click();
          }
          this.newForm.reset();
          this.toastr.success(resp.message);
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
