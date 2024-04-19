import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  projectDet: any = '';
  projectId: any = '';
  committedForm!: FormGroup;
  committedLines: any[] = [];
  totalAmount: any = 0;
  itemsDropdown: any[] = []
  dropdownOptionsCmt: any[] = []
  data: any[] = [];
  searchQuery = '';

  item_name: any;
  @ViewChild('closeModal') closeModal!: ElementRef;
  orderData: any[] = [];
  supplyName: any = '';
  supplyId: any;
  selectedOptionId: any;
  itemName: any;
  oldPrice: any;
  userName: any = ''

  constructor(private service: CoreService, private toastr: ToastrService) { }


  ngOnInit(): void {

    this.projectDet = localStorage.getItem('projectDetails');
    const parsedData = JSON.parse(this.projectDet);
    this.projectId = parsedData['id']
    this.userName = this.service.getUserName()

    this.committedForm = new FormGroup({
      supplyValue: new FormControl(0, [Validators.required, Validators.min(1)]),
      sourceFile: new FormControl(null, Validators.required),
      memo: new FormControl('', Validators.required),
      // selectedItem: new FormControl(0, [Validators.required, Validators.min(1)]),
      // inputPrice: new FormControl('', Validators.required),
    })

    this.getItemData()

    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    this.service.getItemList(formURlData.toString()).subscribe(item => {
      this.itemsDropdown = item.getDetails.map((cate: { item_name: any, id: any }) => ({ ...cate, itemName: cate.item_name, itemId: cate.id }));
    })

    this.service.getSupplyChain().subscribe(categories => {
      this.dropdownOptionsCmt = categories.supplychainDetails.map((cate: { name: any; id: number; }) => ({ ...cate, itemName: cate.name, itemId: cate.id }));
      //this.supplyId = categories.supplychainDetails.map((name: { id: any; }) => name.id)
    });

  }


  onSubmitCommitted(): void {
    //this.committedForm.markAllAsTouched();
    // if (!this.committedForm.valid) {
    //   //console.log(this.selectedOption)
    //   return
    // }

    this.orderData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`);
      // console.log("Selected Option:", row.selectedOption?.id);
      // console.log("Selected Option:", row.selectedOption?.item_name);
      // console.log("Input Price:", row.inputPrice);
    });

    let rowData: { id: any; item_id: any; old_price: any; new_price: any; }[] = [];

    this.orderData.forEach((row, index) => {
      //console.log(this.oldPrice)
      console.log('row', row)
      console.log('id', row.id)
      console.log('itemid', row.item_id)
      rowData.push({
        id: row.id,
        item_id: row.item_id,
        new_price: row.commited_price,
        old_price: this.oldPrice[index].oldPrice
        //old_price: this.oldPrice[index] ? this.oldPrice[index].oldPrice : 0,
      });
    });


    const formURlData = new URLSearchParams();
    const rowDataString = JSON.stringify(rowData);

    //formData.append('supplier_id', this.committedForm.value.supplyValue);
    formURlData.set('items', rowDataString);
    //formData.append('file', this.committedUploadedFile);

    //formData.append('memo', this.committedForm.value.memo);
    //formData.append('project_id', this.projectId);

    this.service.updateC(formURlData.toString()).subscribe({
      next: (resp) => {
        //console.log(resp)
        if (resp.success === true) {
          this.toastr.success('Request added successfully!');
          this.closeModal.nativeElement.click();
          this.getItemData()
          //this.resetRequest1();
        } else {
          this.toastr.warning('Please check input fields.');
        }
      },
      error: (Error) => {
        //this.request1.msg = 'Bad Request'
        this.toastr.warning('Something went wrong.');
        console.log(Error.message)
      }
    })
  }

  addCommittedRow() {
    this.orderData.push({ item_name: 0, inputPrice: null });
    this.calculateTotalAmountCmt();
  }

  removeCommittedRow(index: number) {
    this.orderData.splice(index, 1);
    this.calculateTotalAmountCmt();
  }

  ngDoCheck() {
    this.calculateTotalAmountCmt()
  }

  calculateTotalAmountCmt() {
    this.totalAmount = this.orderData.reduce((total, row) => {
      return total + (row.commited_price ? parseFloat(row.commited_price) : 0);
    }, 0);
  }

  getItemData() {
    this.data = []
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    this.service.getPurchaseO(formURlData.toString()).subscribe({
      next: (resp) => {
        this.data = resp.suppliers
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  getOrderDetails(product: any) {
    console.log(product)
    this.supplyId = product.supplier_id
    this.itemName = product.item_name

    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    formURlData.set('order_id', product.order_id)
    this.service.getOrderD(formURlData.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.orderData = resp.orders;
        this.oldPrice = this.orderData.map((cate: { commited_price: any; }) => ({ oldPrice: cate.commited_price }));
        console.log(this.oldPrice)
      }
    })
  }


}
