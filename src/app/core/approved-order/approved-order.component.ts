import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-approved-order',
  templateUrl: './approved-order.component.html',
  styleUrls: ['./approved-order.component.css']
})
export class ApprovedOrderComponent implements OnInit {

  @ViewChild('closeModal') closeModal!: ElementRef;

  projectDet: any = '';
  projectId: any = '';
  approvedLines: any[] = [];
  approvedForm!: FormGroup;
  totalAmountApp: any = 0;
  itemsDropdown: any[] = [];
  dropdownOptions: any[] = [];
  data: any[] = [];
  orderData: any[] = [];
  supplyId: any;
  itemName: any;
  oldPrice: any;
  searchQuery = '';
  userName: any = '';

  constructor(private service: CoreService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.projectDet = localStorage.getItem('projectDetails');
    const parsedData = JSON.parse(this.projectDet);
    this.projectId = parsedData['id']
    this.userName = this.service.getUserName()

    this.approvedForm = new FormGroup({
      supplyValue: new FormControl(0, Validators.required),
      sourceFile2: new FormControl(null, Validators.required),
      memo1: new FormControl('', Validators.required)
    })

    this.getItemData()

    // const formURlData = new URLSearchParams();
    // formURlData.set('project_id', this.projectId)
    // this.service.getItemList(formURlData.toString()).subscribe(item => {
    //   this.itemsDropdown = item.getDetails.map((cate: { item_name: any, id: any }) => ({ ...cate, itemName: cate.item_name, itemId: cate.id }));
    // })

    this.service.getSupplyChain().subscribe(categories => {
      this.dropdownOptions = categories.supplychainDetails.map((cate: { name: any; id: number; }) => ({ ...cate, itemName: cate.name, itemId: cate.id }));
    });

  }

  onSubmitApproved(): void {

    const formURlData = new URLSearchParams();
    this.orderData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      // console.log("Selected Option:", row.selectedOptionApp?.id);
      // console.log("Selected Option:", row.selectedOptionApp?.item_name);
      // console.log("Input Price:", row.inputPrice);
    });

    let rowData: { id: any; item_id: any; old_price: any; new_price: any; }[] = [];

    this.orderData.forEach((row, index) => {
      rowData.push({
        id: row.id,
        item_id: row.item_id,
        new_price: row.approved_co,
        old_price: this.oldPrice[index].oldPrice
        //old_price: this.oldPrice[index] ? this.oldPrice[index].oldPrice : 0,
      });
    });

    const rowDataString = JSON.stringify(rowData);

    formURlData.set('items', rowDataString);

    this.service.updateA(formURlData.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        if (resp.success === true) {
          this.toastr.success('Request added successfully!');
          this.closeModal.nativeElement.click();
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
    this.orderData.push({ item_name: 0, inputPrice: null });
    this.calculateTotalAmountApp()
  }

  removeApprovedRow(index: number) {
    this.orderData.splice(index, 1);
    this.calculateTotalAmountApp()
  }

  ngDoCheck() {
    this.calculateTotalAmountApp()
  }

  calculateTotalAmountApp() {
    this.totalAmountApp = this.orderData.reduce((total, row) => {
      return total + (row.approved_co ? parseFloat(row.approved_co) : 0);
    }, 0);
  }

  getItemData() {
    this.data = []
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    this.service.getPurchaseA(formURlData.toString()).subscribe({
      next: (resp) => {
        this.data = resp.suppliers
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  getOrderDetails(product: any) {
    const formURlData1 = new URLSearchParams();
    formURlData1.set('project_id', this.projectId)
    this.service.getItemList(formURlData1.toString()).subscribe(item => {
      this.itemsDropdown = item.getDetails.map((cate: { item_name: any, id: any }) => ({ ...cate, itemName: cate.item_name, itemId: cate.id }));
    })

    this.supplyId = product.supplier_id
    this.itemName = product.item_name
    //this.oldPrice = product.approved_co
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    formURlData.set('order_id', product.order_id)
    this.service.getOrderD(formURlData.toString()).subscribe({
      next: (resp) => {
        this.orderData = resp.orders;
        this.oldPrice = this.orderData.map((cate: { approved_co: any; }) => ({ oldPrice: cate.approved_co }));
        console.log(this.oldPrice)
      }
    })
  }


}
