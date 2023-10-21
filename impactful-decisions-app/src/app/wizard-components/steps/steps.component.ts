import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit{  


  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.setActiveStep();
      }
    });
    }

    ngOnInit(): void {
      this.setActiveStep();
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
    this.router.navigate([`decisions/create/${step}/`]);
  }
  
  
}
