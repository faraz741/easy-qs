import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProjectComponent } from './all-project/all-project.component';
import { CostReportComponent } from './cost-report/cost-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { SupplyChainComponent } from './supply-chain/supply-chain.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ApprovedOrderComponent } from './approved-order/approved-order.component';
import { ExpenceCategComponent } from './expence-categ/expence-categ.component';
import { FinancialReportsComponent } from './financial-reports/financial-reports.component';
import { UsersComponent } from './users/users.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectAdminComponent } from './project-admin/project-admin.component';
import { NewProjectModalComponent } from './new-project-modal/new-project-modal.component';
import { IncurredCostComponent } from './incurred-cost/incurred-cost.component';
import { RevenueReportComponent } from './revenue-report/revenue-report.component';
import { ApprovedRevenueComponent } from './approved-revenue/approved-revenue.component';
import { ProjectTeamComponent } from './project-team/project-team.component';


const routes: Routes = [
  {
    path: 'main', component: MainComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "dashboard/:id",
        component: DashboardComponent,
      },
      {
        path: "cost-report",
        component: CostReportComponent,
      },
      {
        path: "cost-report/:id",
        component: CostReportComponent,
      },
      {
        path: "supply-chain",
        component: SupplyChainComponent,
      },
      {
        path: "purchase-order",
        component: PurchaseOrderComponent,
      },
      {
        path: "approved-order",
        component: ApprovedOrderComponent,
      },
      {
        path: "expence-categorization",
        component: ExpenceCategComponent,
      },
      {
        path: "financial-reports",
        component: FinancialReportsComponent,
      },
      {
        path: "users",
        component: UsersComponent,
      },
      {
        path: "incurred-cost",
        component: IncurredCostComponent,
      },
      {
        path: "revenue-report",
        component: RevenueReportComponent,
      },
      {
        path: "approved-revenue",
        component: ApprovedRevenueComponent,
      },
      {
        path: "project-team",
        component: ProjectTeamComponent,
      },
    ]
  },
  {
    path: 'admin', component: ProjectAdminComponent,

    children: [
      { path: '', redirectTo: 'new', pathMatch: 'full' },
      {
        path: "new",
        component: NewProjectComponent,
      },
      {
        path: "all-project",
        component: AllProjectComponent,
      },
      {
        path: "new-modal",
        component: NewProjectModalComponent,
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
