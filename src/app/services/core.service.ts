import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  userDet: any = '';
  userName: any = '';

  // apiUrl = 'http://44.217.97.124:4000'
  apiUrl = 'http://localhost:4000'

  private totalCost: number = 0;
  private totalContractVal: number = 0;
  private totalVariationVal: number = 0;

  constructor(private http: HttpClient, private route: Router) { }


  setTotalCost(value: number) {
    this.totalCost = value;
  }

  getTotalCost() {
    return this.totalCost;
  }

  setConteractVal(value: number) {
    this.totalContractVal = value;
  }

  getConteractVal() {
    return this.totalContractVal;
  }

  setVariationVal(value: number) {
    this.totalVariationVal = value;
  }

  getVariationVal() {
    return this.totalVariationVal;
  }

  getUserName() {
    this.userDet = localStorage.getItem('userDetail');
    const userData = JSON.parse(this.userDet);
    return this.userName = userData['first_name'];
  }

  addProject(params: any): Observable<any> {
    // const authToken = localStorage.getItem('token');
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Authorization': `Bearer ${authToken}`
    // });
    return this.http.post<any>(this.apiUrl + '/newproject', params);
  }

  getProjectList(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/project-list');
  }

  getSupplyChain(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/supply-list');
  }

  addSupplyChain(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/add-supply', params);
  }

  addItem(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/cost_report/addItem', params);
  }

  getItemList(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/cost_report/getCostReport', params);
  }

  addPurchaseOrder(params: any) {
    return this.http.post<any>(this.apiUrl + '/cost_report/addPurchaseOrder', params);
  }

  addApproveOrder(params: any) {
    return this.http.post<any>(this.apiUrl + '/cost_report/addApprovedCo', params);
  }

  addVal(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/cost_report/updateCosts', params);
  }

  //list
  getPurchaseO(params: any) {
    return this.http.post<any>(this.apiUrl + '/cost_report/getSupplierReport', params);
  }

  getPurchaseA(params: any) {
    return this.http.post<any>(this.apiUrl + '/cost_report/getSupplierReportApproval', params);
  }

  //model
  getOrderD(params: any) {
    return this.http.post<any>(this.apiUrl + '/cost_report/getOrderDetails', params);
  }

  updateC(params: any) {
    return this.http.post<any>(this.apiUrl + '/cost_report/updatePurchaseSupplierC', params);
  }

  updateA(params: any) {
    return this.http.post<any>(this.apiUrl + '/cost_report/updatePurchaseSupplierA', params);
  }

  ////phase2////

  addProjectTeam(params: any) {
    return this.http.post<any>(this.apiUrl + '/revenue/addProjectTeam', params);
  }

  addVariationItem(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/revenue/addItemVariation', params);
  }

  getVariationItem(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/revenue/getContractVariation', params);
  }

  getContractItem(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/revenue/getContOrderDetails', params);
  }

getApi(url:any):Observable<any>{
  return this.http.get(this.apiUrl + url )
};
postAPI(url:any, data:any):Observable<any>{
  return this.http.post(this.apiUrl + url ,data )
};

  getRevenueList(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/revenue/getApproveRevenue', params);
  }

  addContractItem(params: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/revenue/addItem', params);
  };




}
