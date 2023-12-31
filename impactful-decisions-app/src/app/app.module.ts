import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserRegistrationComponent } from './auth-components/user-registration/user-registration.component';
import { UserLoginComponent } from './auth-components/user-login/user-login.component';
import { HeaderComponent } from './dashboard-components/header/header.component';
import { MainComponent } from './dashboard-components/main/main.component';
import { SideNavComponent } from './dashboard-components/side-nav/side-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Components
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';



// Font Awesome Module
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardContainerComponent } from './dashboard-components/dashboard-container/dashboard-container.component';
import { HelloComponent } from './dashboard-components/main-components/hello/hello.component';
import { DecisionStatsComponent } from './dashboard-components/main-components/decision-stats/decision-stats.component';
import { RecentDecisionsComponent } from './dashboard-components/main-components/recent-decisions/recent-decisions.component';
import { AllDecisionsComponent } from './dashboard-components/side-nav-components/all-decisions/all-decisions.component';
import { StepsComponent } from './wizard-components/steps/steps.component';
import { DecisionInfoComponent } from './wizard-components/decision-info/decision-info.component';
import { AnalysisResultsComponent } from './wizard-components/analysis-results/analysis-results.component';
import { AddOptionsComponent } from './wizard-components/add-options/add-options.component';
import { AddCriteriaComponent } from './wizard-components/add-criteria/add-criteria.component';
import { AddProsConsComponent } from './wizard-components/add-pros-cons/add-pros-cons.component';
import { SummaryComponent } from './wizard-components/summary/summary.component';
import { DecisionDetailsComponent } from './decision-details/decision-details.component';
import { ConfirmDialogComponent } from './dialog-components/confirm-dialog/confirm-dialog.component';
import { ProConDialogComponent } from './dialog-components/pro-con-dialog/pro-con-dialog.component';
import { CriteriaDialogComponent } from './dialog-components/criteria-dialog/criteria-dialog.component';
import { WelcomeDialogComponent } from './dialog-components/welcome-dialog/welcome-dialog.component';
import { OptionsDialogComponent } from './dialog-components/options-dialog/options-dialog.component';
import { SummaryDialogComponent } from './dialog-components/summary-dialog/summary-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationComponent,
    UserLoginComponent,
    HeaderComponent,
    MainComponent,
    SideNavComponent,
    DashboardContainerComponent,
    HelloComponent,
    DecisionStatsComponent,
    RecentDecisionsComponent,
    AllDecisionsComponent,
    StepsComponent,
    DecisionInfoComponent,
    AnalysisResultsComponent,
    AddOptionsComponent,
    AddCriteriaComponent,
    AddProsConsComponent,
    SummaryComponent,
    DecisionDetailsComponent,
    ConfirmDialogComponent,
    ProConDialogComponent,
    CriteriaDialogComponent,
    WelcomeDialogComponent,
    OptionsDialogComponent,
    SummaryDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgChartsModule,

    // Angular Material Modules
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSliderModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
