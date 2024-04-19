import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { AllProjectComponent } from './all-project/all-project.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { MainComponent } from './main/main.component';
import { CostReportComponent } from './cost-report/cost-report.component';
import { SupplyChainComponent } from './supply-chain/supply-chain.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ApprovedOrderComponent } from './approved-order/approved-order.component';
import { ExpenceCategComponent } from './expence-categ/expence-categ.component';
import { FinancialReportsComponent } from './financial-reports/financial-reports.component';
import { UsersComponent } from './users/users.component';
import { ProjectAdminComponent } from './project-admin/project-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewProjectModalComponent } from './new-project-modal/new-project-modal.component';
import { DatePipe } from '@angular/common';
import { FilterPipe } from '../services/pipe/filter.pipe';
import { IncurredCostComponent } from './incurred-cost/incurred-cost.component';
import { RevenueReportComponent } from './revenue-report/revenue-report.component';
import { ApprovedRevenueComponent } from './approved-revenue/approved-revenue.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { EditInvoiceComponent } from './incurred-cost/edit-invoice/edit-invoice.component';
import { EditTimesheetComponent } from './incurred-cost/edit-timesheet/edit-timesheet.component';


@NgModule({
  declarations: [
    NewProjectComponent,
    DashboardComponent,
    HeaderComponent,
    AllProjectComponent,
    SidemenuComponent,
    MainComponent,
    CostReportComponent,
    SupplyChainComponent,
    PurchaseOrderComponent,
    ApprovedOrderComponent,
    ExpenceCategComponent,
    FinancialReportsComponent,
    UsersComponent,
    ProjectAdminComponent,
    NewProjectModalComponent,
    FilterPipe,
    IncurredCostComponent,
    RevenueReportComponent,
    ApprovedRevenueComponent,
    ProjectTeamComponent,
    EditInvoiceComponent,
    EditTimesheetComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  exports: [
    FilterPipe,
  ]
})
export class CoreModule { }
