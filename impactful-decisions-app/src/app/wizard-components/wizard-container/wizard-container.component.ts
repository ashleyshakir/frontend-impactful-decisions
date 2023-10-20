import { Component } from '@angular/core';
import { Decision } from 'src/app/models/decsion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wizard-container',
  templateUrl: './wizard-container.component.html',
  styleUrls: ['./wizard-container.component.scss']
})
export class WizardContainerComponent {
   currentStep: number = 1;
   totalSteps: number = 6;

   constructor(private router: Router) { }

   nextStep() : void{
    if(this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.router.navigate(['/decisions/create/step' + this.currentStep]);
   }
  }
  prevStep(): void{
    if(this.currentStep > 1) {
      this.currentStep--;
      this.router.navigate(['/decisions/create/step' + this.currentStep]);
   }

  }


}
