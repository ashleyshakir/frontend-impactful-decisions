import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { faBell, faHouse, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit{  
  public username: string = '';
  public initial: string = '';
  faHouse = faHouse;
  faAngleDown = faAngleDown;
  faBell = faBell;
  showDropdown = false;


  constructor(private router: Router, private route: ActivatedRoute, private authService : AuthService) {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.setActiveStep();
      }
    });
    }

    ngOnInit(): void {
      this.setActiveStep();
      console.log("User in AuthService: ", this.authService.user);
      this.username = this.authService.user? this.authService.user.username : '';
      this.initial = this.authService.user? this.authService.user.username[0].toUpperCase() : '';
    }

  activeStep: number = 1;

  setActiveStep(): void {
    const currentRoute = this.router.url.split('/')[3];
    if (currentRoute) {
      switch (currentRoute) {
        case 'step1':
          this.activeStep = 1;
          break;
        case 'step2':
          this.activeStep = 2;
          break;
        case 'step3':
          this.activeStep = 3;
          break;
        case 'step4':
          this.activeStep = 4;
          break;
        case 'step5':
          this.activeStep = 5;
          break;
        case'step6':
          this.activeStep = 6;
          break;
        default:
          this.activeStep = 1; // Default to step 1
      }
    }
  }
  navigateTo(step: string): void {
    this.router.navigate([`decisions/create/${step}`]);
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showDropdown = false;
  }
  home(): void{
    this.router.navigate(['/dashboard']);
  }
  
  
}
