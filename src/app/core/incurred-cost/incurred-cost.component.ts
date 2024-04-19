import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-incurred-cost',
  templateUrl: './incurred-cost.component.html',
  styleUrls: ['./incurred-cost.component.css']
})
export class IncurredCostComponent {

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal2') closeModal2!: ElementRef;

  data: any[] = [];
  projectDet: any = '';
  projectId: any = '';
  userName: any = ''
  searchQuery = '';
  invoiceLine: any[] = [];
  timesheetLine: any[] = [];
  invoiceForm!: FormGroup;
  timesheetForm!: FormGroup;
  dropdownOptionsInvoice: any[] = []
  dropdownOptionsTimesheet: any[] = []
  itemsDropdown: any[] = []
  totalAmountInvoice: any = 0;
  totalAmountTimesheet: any = 0;

  supplyId: any;

  constructor(private service: CoreService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.projectDet = localStorage.getItem('projectDetails');
    const parsedData = JSON.parse(this.projectDet);
    this.projectId = parsedData['id']
    this.userName = this.service.getUserName()

    this.invoiceForm = new FormGroup({
      supplyValue: new FormControl(0, [Validators.required, Validators.min(1)]),
      sourceFile: new FormControl(null, Validators.required),
      memo: new FormControl('', Validators.required),
      paymentDate: new FormControl('', Validators.required)
    })

    this.timesheetForm = new FormGroup({
      supplyValue: new FormControl(0, [Validators.required, Validators.min(1)]),
      sourceFile: new FormControl(null, Validators.required),
      memo: new FormControl('', Validators.required),
      paymentDate: new FormControl('', Validators.required)
    })

    this.getItemData()
    this.addInvoiceRow()
    this.addTimesheetRow()

    this.service.getSupplyChain().subscribe(categories => {
      this.dropdownOptionsInvoice = categories.supplychainDetails.map((cate: { name: any; id: number; }) => ({ ...cate, itemName: cate.name, itemId: cate.id }));
      this.dropdownOptionsTimesheet = categories.supplychainDetails.map((cate: { name: any; id: number; }) => ({ ...cate, itemName: cate.name, itemId: cate.id }));
    });

  }


  /////////////////Add Invoice///////////////////

  // handleCommittedFileInput(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length > 0) {
  //     this.committedUploadedFile = inputElement.files[0];
  //     this.committedfilename = this.committedUploadedFile.name;
  //     this.committedfilesize = this.getFileSize(this.committedUploadedFile.size);
  //   }
  // }

  // getFileSize(bytes: number): string {
  //   const kb = bytes / 1024;
  //   if (kb < 1024) {
  //     return kb.toFixed(2) + ' KB';
  //   } else {
  //     const mb = kb / 1024;
  //     return mb.toFixed(2) + ' MB';
  //   }
  // }

  onSubmitInvoice(): void {
    this.invoiceForm.markAllAsTouched();
    if (!this.invoiceForm.valid) {
      //console.log(this.selectedOption)
      this.toastr.warning('Please check all fields.');
      return
    }

    this.invoiceLine.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      console.log("Selected Option:", row.selectedOption?.id);
      console.log("Selected Option:", row.selectedOption?.item_name);
      console.log("Input Price:", row.inputPrice);
    });

    let rowData: { itemsId: any; ItemName: any; price: any; }[] = [];

    this.invoiceLine.forEach((row, index) => {
      rowData.push({
        itemsId: row.selectedOption?.id,
        ItemName: row.selectedOption?.item_name,
        price: row.inputPrice
      });
    });

    const formData = new FormData();
    const rowDataString = JSON.stringify(rowData);
    formData.append('supplier_id', this.invoiceForm.value.supplyValue);
    formData.append('items', rowDataString);
    //formData.append('file', this.committedUploadedFile);
    formData.append('memo', this.invoiceForm.value.memo);
    formData.append('paymentDate', this.invoiceForm.value.paymentDate);
    formData.append('project_id', this.projectId);

    this.service.addPurchaseOrder(formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.toastr.success('Request added successfully!');
          this.closeModal.nativeElement.click();
          this.getItemData()
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

  addInvoiceRow() {
    this.invoiceLine.push({ selectedOption: 0, inputPrice: null });
    this.calculateTotalAmountInvoice()
  }

  removeInvoiceRow(index: number) {
    this.invoiceLine.splice(index, 1);
    this.calculateTotalAmountInvoice()
  }

  ngDoCheck() {
    this.calculateTotalAmountInvoice();
    this.calculateTotalAmountTimesheet();
  }

  calculateTotalAmountInvoice() {
    this.totalAmountInvoice = this.invoiceLine.reduce((total, row) => {
      return total + (row.approved_co ? parseFloat(row.approved_co) : 0);
    }, 0);
  }

  ///////////////end////////////////



  /////////////////Add Timesheet///////////////////

  // handleCommittedFileInput(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length > 0) {
  //     this.committedUploadedFile = inputElement.files[0];
  //     this.committedfilename = this.committedUploadedFile.name;
  //     this.committedfilesize = this.getFileSize(this.committedUploadedFile.size);
  //   }
  // }

  // getFileSize(bytes: number): string {
  //   const kb = bytes / 1024;
  //   if (kb < 1024) {
  //     return kb.toFixed(2) + ' KB';
  //   } else {
  //     const mb = kb / 1024;
  //     return mb.toFixed(2) + ' MB';
  //   }
  // }

  onSubmitTimesheet(): void {
    this.invoiceForm.markAllAsTouched();
    if (!this.invoiceForm.valid) {
      //console.log(this.selectedOption)
      this.toastr.warning('Please check all fields.');
      return
    }

    this.timesheetLine.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      console.log("Selected Option:", row.selectedOption?.id);
      console.log("Selected Option:", row.selectedOption?.item_name);
      console.log("Input Price:", row.inputPrice);
    });

    let rowData: { itemsId: any; ItemName: any; price: any; }[] = [];

    this.timesheetLine.forEach((row, index) => {
      rowData.push({
        itemsId: row.selectedOption?.id,
        ItemName: row.selectedOption?.item_name,
        price: row.inputPrice
      });
    });

    const formData = new FormData();
    const rowDataString = JSON.stringify(rowData);
    formData.append('supplier_id', this.timesheetForm.value.supplyValue);
    formData.append('items', rowDataString);
    //formData.append('file', this.committedUploadedFile);
    formData.append('memo', this.timesheetForm.value.memo);
    formData.append('paymentDate', this.timesheetForm.value.paymentDate);
    formData.append('project_id', this.projectId);

    this.service.addPurchaseOrder(formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.toastr.success('Request added successfully!');
          this.closeModal2.nativeElement.click();
          this.getItemData()
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

  addTimesheetRow() {
    this.timesheetLine.push({ selectedOption: 0, inputPrice: null });
    this.calculateTotalAmountInvoice()
  }

  removeTimesheetRow(index: number) {
    this.timesheetLine.splice(index, 1);
    this.calculateTotalAmountInvoice()
  }

  calculateTotalAmountTimesheet() {
    this.totalAmountTimesheet = this.timesheetLine.reduce((total, row) => {
      return total + (row.approved_co ? parseFloat(row.approved_co) : 0);
    }, 0);
  }

  ///////////////end////////////////

  getItemData() {
    this.data = []
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    this.service.getItemList(formURlData.toString()).subscribe({
      next: (resp) => {
        this.data = resp.getDetails

        this.itemsDropdown = resp.getDetails.map((cate: { item_name: any, id: any }) => ({ ...cate, itemName: cate.item_name, itemId: cate.id }));

      },
      error: error => {
        console.log(error.message)
      }
    });
  }

}
