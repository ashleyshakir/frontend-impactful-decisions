import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './auth-components/user-registration/user-registration.component';
import { UserLoginComponent } from './auth-components/user-login/user-login.component';
import { DashboardContainerComponent } from './dashboard-components/dashboard-container/dashboard-container.component';
import { AuthGuard } from './services/auth-guard';
import { AllDecisionsComponent } from './dashboard-components/side-nav-components/all-decisions/all-decisions.component';
import { DecisionInfoComponent } from './wizard-components/decision-info/decision-info.component';
import { AddOptionsComponent } from './wizard-components/add-options/add-options.component';
import { AddCriteriaComponent } from './wizard-components/add-criteria/add-criteria.component';
import { AddProsConsComponent } from './wizard-components/add-pros-cons/add-pros-cons.component';
import { SummaryComponent } from './wizard-components/summary/summary.component';
import { AnalysisResultsComponent } from './wizard-components/analysis-results/analysis-results.component';
import { DecisionDetailsComponent } from './decision-details/decision-details.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'register', 
    component: UserRegistrationComponent
  },
  {
    path: 'login', 
    component: UserLoginComponent
  },
  {
    path: 'dashboard', 
    component: DashboardContainerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'decisions',
    component: AllDecisionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'decisions/:id',
    component: DecisionDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'decisions/create/step1',
    component: DecisionInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'decisions/create/step2',
    component: AddOptionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'decisions/create/step3',
    component: AddCriteriaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'decisions/create/step4',
    component: AddProsConsComponent,
    canActivate: [AuthGuard]
  },
  {
  path: 'decisions/create/step5',
  component: SummaryComponent,
  canActivate: [AuthGuard]
  },
  {
    path: 'decisions/create/step6',
    component: AnalysisResultsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
