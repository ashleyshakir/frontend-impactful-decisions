import { Component } from '@angular/core';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  faCirclePlus = faCirclePlus;

  constructor(private router: Router) { }

  navigateToDecisions() {
    this.router.navigate(['/decisions']);
  }
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  navigateToWizard() {
    this.router.navigate(['/decisions/create/step1']);
  }

}
