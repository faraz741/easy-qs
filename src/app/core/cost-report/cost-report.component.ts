import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CoreService } from 'src/app/services/core.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cost-report',
  templateUrl: './cost-report.component.html',
  styleUrls: ['./cost-report.component.css']
})
export class CostReportComponent implements OnInit {

  @ViewChild('myForm') myForm!: NgForm;
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;

  data: any[] = [];
  selectedOption: any;
  selectedOptionApp: any;
  price: any;
  inputPrice: any[] = []
  itemName: any;
  committedForm!: FormGroup;
  approvedForm!: FormGroup;
  dropdownOptionsCmt: any[] = []
  dropdownOptionsApp: any[] = []
  itemsDropdown: any[] = []
  editModeMap: { [key: number]: boolean } = {};
  committedLines: any[] = [];
  approvedLines: any[] = [];
  committedUploadedFile!: File;
  approvedUploadedFile!: File;
  committedfilename: string = '';
  committedfilesize: string = '';
  approvedfilename: string = '';
  approvedfilesize: string = '';
  projectDet: any = '';
  projectId: any = '';
  pStartDate: any = '';
  pEndDate: any = '';
  itemsId!: number;
  itemsName!: string;
  tenderPriceChanged: boolean = false;
  budgetCostsChanged: boolean = false;
  //inputValues: { [key: number]: string } = {};
  totalAmount: any = 0;
  totalAmountApp: any = 0;
  //totalCosts1: any[] = [];
  tableData!: any[];
  itemTotalCost: any;
  editableRowIndex: number = -1;


  constructor(private service: CoreService, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.projectDet = localStorage.getItem('projectDetails');
    const parsedData = JSON.parse(this.projectDet);
    this.projectId = parsedData['id']
    this.pStartDate = parsedData['start_date']
    this.pEndDate = parsedData['completion_date']

    this.committedForm = new FormGroup({
      supplyValue: new FormControl(0, [Validators.required, Validators.min(1)]),
      sourceFile: new FormControl(null, Validators.required),
      memo: new FormControl('', Validators.required),
      // selectedItem: new FormControl(0, [Validators.required, Validators.min(1)]),
      // inputPrice: new FormControl('', Validators.required),
    })

    this.approvedForm = new FormGroup({
      supplyValue: new FormControl(0, Validators.required),
      sourceFile2: new FormControl(null, Validators.required),
      memo1: new FormControl('', Validators.required)
    })

    this.getItemData()

    this.service.getSupplyChain().subscribe(categories => {
      this.dropdownOptionsCmt = categories.supplychainDetails.map((cate: { name: any; id: number; }) => ({ ...cate, itemName: cate.name, itemId: cate.id }));
      this.dropdownOptionsApp = categories.supplychainDetails.map((cate: { name: any; id: number; }) => ({ ...cate, itemName: cate.name, itemId: cate.id }));
    });

    this.addCommittedRow();
    this.addApprovedRow();

  }

  calculateTenderPrice(): any {
    return this.data.reduce((total, item) => total + parseFloat(item.tender_price), 0);
  }

  calculateCommittedPrice(): any {
    return this.data.reduce((total, item) => total + parseFloat(item.commited_price), 0);
  }

  calculateBudgetCosts(): any {
    return this.data.reduce((total, item) => total + parseFloat(item.budget_costs), 0);
  }

  calculateApprovedCOst(): any {
    return this.data.reduce((total, item) => total + parseFloat(item.approved_co), 0);
  }

  calculateTotalCost(): any {
    return this.data.reduce((total, item) => total + parseFloat(item.total_cost), 0);
  }

  calculateTotalCost1(): void {
    this.itemTotalCost = this.data.reduce((total, item) => total + parseFloat(item.total_cost), 0);
    this.service.setTotalCost(this.itemTotalCost);
  }

  //////////////////Add Commited Price//////////////////

  @ViewChild('itemIdInput') itemIdInput!: ElementRef;

  fileInput = document.getElementById("exampleInputFile") as HTMLInputElement;

  handleCommittedFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.committedUploadedFile = inputElement.files[0];
      this.committedfilename = this.committedUploadedFile.name;
      this.committedfilesize = this.getFileSize(this.committedUploadedFile.size);
    }
  }

  onSubmitCommitted(): void {
    this.committedForm.markAllAsTouched();
    if (!this.committedForm.valid) {
      console.log(this.selectedOption)
      this.toastr.warning('Please check all fields.');
      return
    }

    this.committedLines.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      console.log("Selected Option:", row.selectedOption?.id);
      console.log("Selected Option:", row.selectedOption?.item_name);
      console.log("Input Price:", row.inputPrice);
    });

    let rowData: { itemsId: any; ItemName: any; price: any; }[] = [];

    this.committedLines.forEach((row, index) => {
      rowData.push({
        itemsId: row.selectedOption?.id,
        ItemName: row.selectedOption?.item_name,
        price: row.inputPrice
      });
    });

    const formData = new FormData();
    const rowDataString = JSON.stringify(rowData);
    formData.append('supplier_id', this.committedForm.value.supplyValue);
    formData.append('items', rowDataString);
    formData.append('file', this.committedUploadedFile);
    //formData.append('items', JSON.stringify(this.committedLines));
    formData.append('memo', this.committedForm.value.memo);
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
  };

  addCommittedRow() {
    this.committedLines.push({ selectedOption: 0, inputPrice: null });
    this.calculateTotalAmountCmt();
  }

  removeCommittedRow(index: number) {
    this.committedLines.splice(index, 1);
    this.calculateTotalAmountCmt();
  }

  ngDoCheck() {
    this.calculateTotalAmountCmt();
    this.calculateTotalAmountApp();
  };

  calculateTotalAmountCmt() {
    this.totalAmount = this.committedLines.reduce((total, row) => {
      return total + (row.inputPrice ? parseFloat(row.inputPrice) : 0);
    }, 0);
  }

  getFileSize(bytes: number): string {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return kb.toFixed(2) + ' KB';
    } else {
      const mb = kb / 1024;
      return mb.toFixed(2) + ' MB';
    }
  }

  //////////////////////////////////////////////////////////////////////


  //////////////////Add Approved Cost//////////////////

  fileInput1 = document.getElementById("exampleInputFile1") as HTMLInputElement;

  handleApprovedFileInput(event: Event) {
    const inputElement1 = event.target as HTMLInputElement;
    if (inputElement1.files && inputElement1.files.length > 0) {
      this.approvedUploadedFile = inputElement1.files[0];
      this.approvedfilename = this.approvedUploadedFile.name;
      this.approvedfilesize = this.getAppFileSize(this.approvedUploadedFile.size);
    }
  }

  onSubmitApproved(): void {

    this.approvedForm.markAllAsTouched();
    if (!this.approvedForm.valid) {
      this.toastr.warning('Please check all fields.');
      //console.log(this.selectedOption)
      return
    }

    const formData = new FormData();
    this.approvedLines.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      console.log("Selected Option:", row.selectedOptionApp?.id);
      console.log("Selected Option:", row.selectedOptionApp?.item_name);
      console.log("Input Price:", row.inputPrice);
    });

    let rowData: { itemsId: any; ItemName: any; price: any; }[] = [];

    this.approvedLines.forEach((row, index) => {
      console.log(row)
      rowData.push({
        itemsId: row.selectedOptionApp?.id,
        ItemName: row.selectedOptionApp?.item_name,
        price: row.inputPrice
      });
    });

    const rowDataString = JSON.stringify(rowData);
    formData.append('supplier_id', this.approvedForm.value.supplyValue);
    formData.append('items', rowDataString);
    formData.append('file', this.approvedUploadedFile);
    //formData.append('items', JSON.stringify(this.committedLines));
    formData.append('memo', this.approvedForm.value.memo1);
    formData.append('project_id', this.projectId);
    this.service.addApproveOrder(formData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.toastr.success('Request added successfully!');
          this.closeModal1.nativeElement.click();
          this.getItemData()
        }
      },
      error: (Error) => {
        this.toastr.warning('Something went wrong.');
        console.log(Error.message)
      }
    })
  }

  addApprovedRow() {
    this.approvedLines.push({ selectedOptionApp: 0, inputPrice: null });
    this.calculateTotalAmountApp()
  }

  removeApprovedRow(index: number) {
    this.approvedLines.splice(index, 1);
    this.calculateTotalAmountApp()
  }

  calculateTotalAmountApp() {
    this.totalAmountApp = this.approvedLines.reduce((total, row) => {
      return total + (row.inputPrice ? parseFloat(row.inputPrice) : 0);
    }, 0);
  }

  getAppFileSize(bytes: number): string {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return kb.toFixed(2) + ' KB';
    } else {
      const mb = kb / 1024;
      return mb.toFixed(2) + ' MB';
    }
  }

  //////////////////////////////////////////////////////////////////////


  getItemData() {
    this.data = []
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    this.service.getItemList(formURlData.toString()).subscribe({
      next: (resp) => {
        const data1: any[] = resp.getDetails
        //this.data = resp.getDetails;
        this.itemsId = data1[0].id
        this.itemsName = data1[0].name
        this.itemsDropdown = resp.getDetails.map((cate: { item_name: any, id: any }) => ({ ...cate, itemName: cate.item_name, itemId: cate.id }));

        this.tableData = resp.getDetails.map((item: { price: any, budget_costs: any }) => ({ ...item, updatedPrice1: item.price, updatedPrice2: item.budget_costs }));

        data1.forEach((product: { tender_price: any; commited_price: any; budget_costs: any; approved_co: any; }, index: number) => {
          const totalCost = parseInt(product.commited_price) + parseInt(product.budget_costs) + parseInt(product.approved_co);
          data1[index]['total_cost'] = totalCost;
        });
        this.data = data1
        this.calculateTotalCost1()
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  addItem(form: any) {
    //this.formSubmitted = true;
    if (form.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('item_name', form.value.inputField)
      formURlData.set('project_id', this.projectId)
      this.service.addItem(formURlData.toString()).subscribe({
        next: resp => {
          if (resp.success === true) {
            this.toastr.success('Item added successfully!');
            this.myForm.resetForm();
            this.getItemData()
            //this.formSubmitted = false; 
          }
        },
        error: error => {
          console.log(error.message)
        }
      });
    }
  }

  sendDataThroughApi(item: any) {
    if (this.tenderPriceChanged || this.budgetCostsChanged) {
      this.editableRowIndex = -1;
      const formURlData = new URLSearchParams();
      formURlData.set('id', item.id)
      formURlData.set('tender_price', item.tender_price)
      formURlData.set('budget_cost', item.budget_costs)
      this.service.addVal(formURlData.toString()).subscribe({
        next: resp => {
          if (resp.success === true) {
            this.toastr.success('Values added successfully!');
            this.getItemData()
          }
          this.getItemData()
        },
        error: err => {
          console.log(err.message)
        }
      });
    }
    this.editableRowIndex = -1;
    this.tenderPriceChanged = false;
    this.budgetCostsChanged = false;
  }

  toggleEditMode1(rowIndex: number) {
    this.editableRowIndex = rowIndex;
  }


}
