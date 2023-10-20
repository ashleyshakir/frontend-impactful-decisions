import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserRegistrationComponent } from './auth components/user-registration/user-registration.component';
import { UserLoginComponent } from './auth components/user-login/user-login.component';
import { HeaderComponent } from './dashboard components/header/header.component';
import { MainComponent } from './dashboard components/main/main.component';
import { SideNavComponent } from './dashboard components/side-nav/side-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Components
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Font Awesome Module
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardContainerComponent } from './dashboard components/dashboard-container/dashboard-container.component';
import { HelloComponent } from './dashboard components/main-components/hello/hello.component';
import { DecisionStatsComponent } from './dashboard components/main-components/decision-stats/decision-stats.component';
import { RecentDecisionsComponent } from './dashboard components/main-components/recent-decisions/recent-decisions.component';

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
    RecentDecisionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
