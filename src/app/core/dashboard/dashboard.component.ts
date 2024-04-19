import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalCost: any;
  totalConteractVal: any;
  totalVariationVal: any;
  ptoc: any;

  constructor(private route: ActivatedRoute, private service: CoreService) { }

  ngOnInit(): void {
    this.totalCost = this.service.getTotalCost() || '-';
    //this.totalCost = this.service.getTotalCost() || '-';
    this.totalConteractVal = this.service.getConteractVal() || '-';
    this.totalVariationVal = this.service.getVariationVal() || '-';
    this.ptoc = (((this.totalConteractVal + this.totalVariationVal) - this.totalCost) / this.totalCost) * 100
    // this.ptoc = parseFloat(this.ptoc.toFixed(2)); 
    this.ptoc = isNaN(this.ptoc) ? 0 : parseFloat(this.ptoc.toFixed(2));
    console.log(this.ptoc)
  }

}
