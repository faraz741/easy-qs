import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-approved-revenue',
  templateUrl: './approved-revenue.component.html',
  styleUrls: ['./approved-revenue.component.css']
})
export class ApprovedRevenueComponent {

  data: any[] = [];
  projectDet: any = '';
  projectId: any = '';
  userName: any = ''
  approvedForm!: FormGroup;
  dropdownOptions: any[] = [];
  searchQuery = '';
  orderData: any[] = [];
  totalAmountApp: any = 0;
  itemsDropdown: any[] = [];
  supplyId: any;

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
    //this.addApprovedRow()

    // this.service.getSupplyChain().subscribe(categories => {
    //   this.dropdownOptions = categories.supplychainDetails.map((cate: { name: any; id: number; }) => ({ ...cate, itemName: cate.name, itemId: cate.id }));
    // });

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
  };

  calculateTotalAmountApp() {
    this.totalAmountApp = this.orderData.reduce((total, row) => {
      return total + (row.approved_co ? parseFloat(row.approved_co) : 0);
    }, 0);
  };


  getItemData() {
    this.data = []
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    this.service.getRevenueList(formURlData.toString()).subscribe({
      next: (resp) => {
        this.data = resp.orders
      },
      error: error => {
        console.log(error.message)
      }
    });
  };

  getOrderDetails(product: any) {
    const formURlData1 = new URLSearchParams();
    formURlData1.set('project_id', this.projectId)
    this.service.getItemList(formURlData1.toString()).subscribe(item => {
      this.itemsDropdown = item.getDetails.map((cate: { item_name: any, id: any }) => ({ ...cate, itemName: cate.item_name, itemId: cate.id }));
    })

    this.supplyId = product.supplier_id
    // this.itemName = product.item_name
    //this.oldPrice = product.approved_co
    const formURlData = new URLSearchParams();
    formURlData.set('project_id', this.projectId)
    formURlData.set('order_id', product.order_id)
    this.service.getOrderD(formURlData.toString()).subscribe({
      next: (resp) => {
        this.orderData = resp.orders;
        //this.oldPrice = this.orderData.map((cate: {approved_co: any;}) => ({ oldPrice: cate.approved_co}));
        //console.log(this.oldPrice)
      }
    })
  }

}
