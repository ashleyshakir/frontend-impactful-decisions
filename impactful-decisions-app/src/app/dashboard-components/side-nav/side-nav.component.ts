import { Component } from '@angular/core';
import { faCirclePlus, faListCheck, faHouse } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  faCirclePlus = faCirclePlus;
  faListCheck = faListCheck;
  faHouse = faHouse;

  constructor(private router: Router, private formService: FormService) { }

  navigateToDecisions() {
    this.router.navigate(['/decisions']);
  }
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  navigateToWizard() {
    this.router.navigate(['/decisions/create/step1']);
    this.formService.clearFormData();
  }

}
