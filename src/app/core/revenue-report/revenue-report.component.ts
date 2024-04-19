import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.css']
})
export class RevenueReportComponent {

  @ViewChild('variationForm') variationForm!: NgForm;
  @ViewChild('contractForm') contractForm!: NgForm;
  @ViewChild('closeModal') closeModal!: ElementRef;
  revenueForm!: FormGroup
  data: any[] = [];
  selectedOption: any;
  projectDet: any = '';
  projectId: any = '';
  userName: any = ''
  searchQuery = '';
  committedLines: any[] = [];
  totalAmountApp: any = 0;
  itemTotalContract: any;
  contractValueChanged: boolean = false;
  contractItems: any[] = [];
  variationItems: any[] = [];
  committedUploadedFile!: File;
  approvedUploadedFile!: File;
  committedfilename: string = '';
  committedfilesize: string = '';

  constructor(private service: CoreService, private toastr: ToastrService) { }

  editableRowIndex: number = -1;

  toggleEditMode1(rowIndex: number) {
    this.editableRowIndex = rowIndex;
  }

  ngOnInit(): void {
    this.revenueForm = new FormGroup({
      sourceFile: new FormControl(null),
      memo: new FormControl('', Validators.required),
      paymentDate: new FormControl('', Validators.required)
      // selectedItem: new FormControl(0, [Validators.required, Validators.min(1)]),
      // inputPrice: new FormControl('', Validators.required),
    })
    this.projectDet = localStorage.getItem('projectDetails');
    const parsedData = JSON.parse(this.projectDet);
    this.projectId = parsedData['id']
    this.userName = this.service.getUserName()
    this.getAllItems();
    // this.getVariationData();
    // this.getContractData();
    this.addApprovedRow()

  }

  addApprovedRow() {
    this.committedLines.push({ selectedOption: 0, inputPrice: null });
    this.calculateTotalAmountApp()
  }

  removeApprovedRow(index: number) {
    this.committedLines.splice(index, 1);
    // this.calculateTotalAmountApp()
  }

  ngDoCheck() {
    this.calculateTotalAmountApp()
  };

  calculateTotalAmountApp() {
    // console.log(this.committedLines);
    this.totalAmountApp = this.committedLines.reduce((total, row) => {
      return total + (row.inputPrice ? parseFloat(row.inputPrice) : 0);
    }, 0);
  }

  // calculateContractVal(): any {
  //   this.itemTotalContract = this.data.reduce((total, item) => total + parseFloat(item.tender_price), 0);
  //   console.log(this.itemTotalContract)
  //   this.service.setConteractVal(this.itemTotalContract);
  // }

  // calculateVariationVal(): any {
  //   this.itemTotalContract = this.data.reduce((total, item) => total + parseFloat(item.tender_price), 0);
  //   console.log(this.itemTotalContract)
  //   this.service.setVariationVal(this.itemTotalContract);
  // }

  getVariationData() {
    this.data = []
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    //this.service.getVariationItem(formURlData.toString()).subscribe({
    this.service.getVariationItem(formURlData.toString()).subscribe({
      next: (resp) => {
        this.data = resp.getDetails
        // this.calculateContractVal()
        // this.calculateVariationVal()
      },
      error: error => {
        console.log(error.message)
      }
    });
  };

  onSubmitCommitted(): void {
    this.revenueForm.markAllAsTouched();
    if (!this.revenueForm.valid) {
      // console.log(this.selectedOption)
      this.toastr.warning('Please check all fields.');
      return
    };

    // console.log(this.committedLines);
    this.contractItems = (this.committedLines).filter((items: any) => items.selectedOption.is_contract_var == "C");
    this.variationItems = (this.committedLines).filter((items: any) => items.selectedOption.is_contract_var == "V");
// console.log(this.contractItems);

 
if(this.contractItems.length > 0){
  const formDataContact = new FormData();
  let contactRowData: {  ItemName: any, contractValue: any,revenueToDate:any }[] = [];

  this.contractItems.forEach((row, index) => {
    contactRowData.push({
      // itemsId: row.selectedOption?.id,
      ItemName: row.selectedOption?.item_name,
      contractValue: 0,
      revenueToDate : row.inputPrice
    });
  });
  const rowDataString = JSON.stringify(contactRowData);
  formDataContact.append('items', rowDataString);
  formDataContact.append('project_id', this.projectId);
  formDataContact.append('memo', this.revenueForm.value.memo);
  formDataContact.append('payment_date', this.revenueForm.value.paymentDate);


  this.service.postAPI('/revenue/addContractWorks',formDataContact).subscribe({
    next: (resp) => {
      if (resp.success === true) {
        this.toastr.success('Request added successfully!');
        this.closeModal.nativeElement.click();
        this.getAllItems()
        // this.getItemData()
      } else {
        this.toastr.warning('Please check input fields.');
      }
    },
    error: (Error) => {
      this.toastr.warning('Something went wrong.');
      console.log(Error.message)
    }
  })
}


if(this.variationItems.length > 0){
  const formDataVaraition = new FormData();
  let contactRowData: {  ItemName: any; contractValue: any; revenueToDate:any }[] = [];

  this.variationItems.forEach((row, index) => {
    contactRowData.push({
      // itemsId: row.selectedOption?.id,
      ItemName: row.selectedOption?.item_name,
      contractValue: 0,
      revenueToDate : row.inputPrice
    });
  });
  const rowDataString = JSON.stringify(contactRowData);
  console.log(rowDataString);
  formDataVaraition.append('items', rowDataString);
  formDataVaraition.append('project_id', this.projectId);
  formDataVaraition.append('memo', this.revenueForm.value.memo);
  formDataVaraition.append('payment_date', this.revenueForm.value.paymentDate);


  this.service.postAPI('/revenue/addVariation',formDataVaraition).subscribe({
    next: (resp) => {
      if (resp.success === true) {
        this.toastr.success('Request added successfully!');
        this.closeModal.nativeElement.click();
        this.getAllItems()
        // this.getItemData()
      } else {
        this.toastr.warning('Please check input fields.');
      }
    },
    error: (Error) => {
      this.toastr.warning('Something went wrong.');
      console.log(Error.message)
    }
  })
}
  };

  // getContractData() {
  //   this.data = []
  //   const formURlData = new URLSearchParams();
  //   formURlData.set('project_id', this.projectId)
  //   //this.service.getVariationItem(formURlData.toString()).subscribe({
  //     this.service.getContractItem(formURlData.toString()).subscribe({
  //     next: (resp) => {
  //       this.data = resp.getDetails
  //       this.calculateContractVal()
  //       this.calculateVariationVal()
  //     },
  //     error: error => {
  //       console.log(error.message)
  //     }
  //   });
  // }
  getAllItems() {
    console.log("callign");
    this.data = []
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    //this.service.getVariationItem(formURlData.toString()).subscribe({
    this.service.postAPI('/revenue/getContractVariation', formURlData.toString()).subscribe({
      next: (resp) => {
        console.log("filterContractItems", resp);
        this.data = resp.getDetails;
        this.contractItems = (resp.getDetails).filter((items: any) => items.is_contract_var == "C");
        this.variationItems = (resp.getDetails).filter((items: any) => items.is_contract_var == "V");
      },
      error: error => {
        console.log(error.message)
      }
    });
  }


  sendContractValue(item: any) {
    // if (this.contractValueChanged) {
    //   this.editableRowIndex = -1;
    //   const formURlData = new URLSearchParams();
    //   formURlData.set('id', item.id)
    //   formURlData.set('tender_price', item.tender_price)
    //   this.service.addVal(formURlData.toString()).subscribe({
    //     next: resp => {
    //       if (resp.success === true) {
    //         this.toastr.success('Values added successfully!');
    //         this.getItemData()
    //       }
    //       this.getItemData()
    //     },
    //     error: err => {
    //       console.log(err.message)
    //     }
    //   });
    // }
    this.editableRowIndex = -1;
    this.contractValueChanged = false;
  }


  addVariationItem(form: any) {
    //this.formSubmitted = true;
    if (form.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('item_name', form.value.inputField)
      formURlData.set('project_id', this.projectId)
      this.service.addVariationItem(formURlData.toString()).subscribe({
        next: resp => {
          if (resp.success === true) {
            this.toastr.success(resp.message);
            this.variationForm.resetForm();
            this.getVariationData()
            //this.formSubmitted = false; 
          } else {
            this.toastr.warning(resp.message);
          }
          this.getAllItems()
        },
        error: error => {
          this.toastr.error('Something went wrong.');
          console.log(error.message)
        }
      });
    }
  };


  fileInput = document.getElementById("exampleInputFile") as HTMLInputElement;

  handleCommittedFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.committedUploadedFile = inputElement.files[0];
      this.committedfilename = this.committedUploadedFile.name;
      this.committedfilesize = this.getFileSize(this.committedUploadedFile.size);
    }
  }



  addContractItem(form: any) {
    //this.formSubmitted = true;
    if (form.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('item_name', form.value.inputField)
      formURlData.set('project_id', this.projectId)
      this.service.addContractItem(formURlData.toString()).subscribe({
        next: resp => {
          if (resp.success === true) {
            this.toastr.success(resp.message);
            this.contractForm.resetForm();
            this.getAllItems()
            // this.getContractData()
            //this.formSubmitted = false; 
          } else {
            this.toastr.warning(resp.message);
            this.contractForm.resetForm();
          }
        },
        error: error => {
          this.toastr.error(error.message);
          console.log(error.message)
        }
      });
    }
  };

  getFileSize(bytes: number): string {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return kb.toFixed(2) + ' KB';
    } else {
      const mb = kb / 1024;
      return mb.toFixed(2) + ' MB';
    }
  }


}
