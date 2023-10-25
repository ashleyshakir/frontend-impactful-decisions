import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecisionService } from 'src/app/services/decision.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProCon, ProConItem } from 'src/app/models/procon.model';
import { Router } from '@angular/router';
import { customProConValidator } from 'src/app/services/custom-validators';
import { FormService } from 'src/app/services/form.service';
import { Option } from 'src/app/models/option.model';
import { Criteria } from 'src/app/models/criteria.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-pros-cons',
  templateUrl: './add-pros-cons.component.html',
  styleUrls: ['./add-pros-cons.component.scss']
})
export class AddProsConsComponent implements OnInit, OnDestroy{
  private subscription!: Subscription;
  proConForm!: FormGroup;
  decisionId!: number | null;
  optionId!: number | null;
  options: Option[] = [];
  criteria: Criteria[] = [];
  ratings: number[] = [1, 2, 3, 4, 5];
  currentOption: any = null;
  currentIndex: number = 0;
  proConData: ProCon = new ProCon();
  lastProSaved: boolean = false;
  lastConSaved: boolean = false;
  isNewDecision: boolean = true;
  originalProData: ProConItem[] = [];
  originalConData: ProConItem[] = [];
  

  constructor(private decisionService: DecisionService,
              private formService : FormService, 
              private fb: FormBuilder, 
              private router : Router) { }

  ngOnInit(): void {
    // Subscribe to form data to get the decisionId
    this.formService.formData$.subscribe(data => {
      this.decisionId = data.decisionId;
    });

    // Initialize the form
    this.proConForm = this.fb.group({
      pros: this.fb.array([this.createPro()]),
      cons: this.fb.array([this.createCon()])
    });  

    // Load existing form data from the service
    this.formService.loadFormDataFromLocalStorage();
    console.log("Data loaded from local storage: ", this.formService.loadFormDataFromLocalStorage())

    this.subscription = this.formService.formData$.subscribe(formData => {
      if(this.decisionId){
        this.handleExistingDecision(this.decisionId);
      } else {
        this.handleNewDecision(formData);
      }
    });

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private clearExistingProCons(): void {
    console.log("existing pros and cons cleared");
    while (this.pros.length) {
      this.pros.removeAt(0);
    }
    while (this.cons.length) {
      this.cons.removeAt(0);
    }
  }
  private addProConsToForm(pros: ProConItem[], cons: ProConItem[]): void {
    console.log("adding pros and cons to form");
    pros.forEach((pro: ProConItem) => {
      this.pros.push(this.createPro(pro.description, pro.rating, pro.criteriaName));
      console.log("adding ", pro);
      console.log("criteria: ", pro.criteriaName)
    });
    cons.forEach((con: ProConItem) => {
      this.cons.push(this.createCon(con.description, con.rating, con.criteriaName));
      console.log("adding ", con);
      console.log("criteria: ", con.criteriaName)
    });
  }
  private handleNewDecision(formData: any): void {
    console.log("handleNewDecision method called");
    console.log("formData.pros: ", formData.pros);
    console.log("formData.cons: ", formData.cons);
    if((formData && formData.pros && Array.isArray(formData.pros)) || (formData  && formData.cons && Array.isArray(formData.cons))) {
      console.log("inside the if condition");
      this.clearExistingProCons();
      this.addProConsToForm(formData.pros, formData.cons);
    }
  }
  private handleExistingDecision(decisionId: number): void {
    console.log("handleExistingDecision method called");
    this.fetchOptions();
  }

  fetchOptions(): void {
    console.log("fetching options method called");
    this.decisionService.getDecisionOptions(this.decisionId!).subscribe(response => {
      this.options = response.data;
      this.currentOption = this.options[this.currentIndex];

      // Fetch pros and cons for the current option
      if (this.currentOption && this.currentOption.id) {
        console.log("inside the condition to fetch pros and cons for current option");
        this.fetchProsAndCons(this.currentOption.id);
        this.fetchCriteria();
      }
    }, error => {
      console.log(error.message);
    });
  }

  fetchCriteria(): void {
    this.decisionService.getDecisionCriteria(this.decisionId!).subscribe(response => {
      this.criteria = response.data;
    }, error => {
      console.log(error.message);
    });
  }

  fetchProsAndCons(optionId: number): void {
    console.log("fetching pros and cons for option with id: ", optionId);
    this.decisionService.getProsAndConsForOption(this.decisionId!, optionId).subscribe(response => {
      if (response.data && Array.isArray(response.data)) {
        this.isNewDecision = false;
        // this.fetchCriteria();
        this.clearExistingProCons();
        const fetchedProCons = response.data;
        console.log("fetched data: ",response.data)
        const fetchedPros = fetchedProCons.filter((item: any) => item.type === 'pro');
        this.originalProData = [...fetchedPros];
        console.log("fetched pros: ",fetchedPros)
        const fetchedCons = fetchedProCons.filter((item: any) => item.type === 'con');
        this.originalConData = [...fetchedCons];
        console.log("fetched cons: ",fetchedCons)
        this.addProConsToForm(fetchedPros, fetchedCons);
      }
    }, error => {
      console.log('Error fetching pros and cons:', error.message);
    });
  }

  createPro(description: string = '', rating: number = 0, criteria: string = ''): FormGroup {
    return this.fb.group({
      description: [description],
      rating: [rating],
      criteria: [criteria],
      type: ['pro']
    },{validator: customProConValidator});
  }

  createCon(description: string = '', rating: number = 0, criteria: string = ''): FormGroup {
    return this.fb.group({
      description: [description],
      rating: [rating],
      criteria: [criteria],
      type: ['con']
    },{validator: customProConValidator});
  }

  get pros(): FormArray {
    return this.proConForm.get('pros') as FormArray;
  }

  get cons(): FormArray {
    return this.proConForm.get('cons') as FormArray;
  }

  addPro(): void {
    const proGroup = this.fb.group({
      description: [''],
      rating: [''],
      criteria: [''],
      type: ['pro']
    },{validator: customProConValidator});
    this.pros.push(proGroup);
  }
  addCon(): void {
    const conGroup = this.fb.group({
      description: [''],
      rating: [''],
      criteria: [''],
      type: ['con']
    },{validator: customProConValidator});
    this.cons.push(conGroup);
  }

  removePro(index: number) {
    this.pros.removeAt(index);
    this.decisionService.deleteProCon(this.decisionId!, this.currentOption!.id!, this.originalProData[index].id!).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  removeCon(index: number) {
    this.cons.removeAt(index);
    this.decisionService.deleteProCon(this.decisionId!, this.currentOption!.id!, this.originalConData[index].id!).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  onSave(): void{
    const proConFormData = this.proConForm.value; 
    const pros = proConFormData.pros; 
    const cons = proConFormData.cons; 
    // If it is a new decision add all pros and cons
    if(this.isNewDecision){
      this.saveProConsforNewDecision(pros, cons);
      this.moveToNextOption();
    // If it is an existing decision update the existing pros and cons
    } else {
      this.updateAndAddProConsForExistingDecision(pros, cons);
      this.moveToNextOption();
    }
  }

  saveProConsforNewDecision(pros: ProConItem[], cons: ProConItem[]): void {
    if (this.decisionId){
      pros.forEach(pro => {
        this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, pro, pro.criteria!).subscribe(response => {
          console.log(response);
        }, error => { 
          console.log(error);
       });
      });
      cons.forEach(con => {
        this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, con, con.criteria!).subscribe(response => {
          console.log(response);
        }, error => {
          console.log(error);
        });
      });
    } else {
      console.error('Decision ID not found!');
    }
  }

  updateAndAddProConsForExistingDecision(pros: ProConItem[], cons: ProConItem[]) : void {
    const newProsToAdd: ProConItem[] = [];
    const newConsToAdd: ProConItem[] = [];

    pros.forEach((newPro, index: number) => {
      console.log('Processing pro at index', index, ':', newPro);
      const originalPro = this.originalProData[index];
      const proId = originalPro ? originalPro.id : null;

      if (proId){
        console.log('Updating existing pro with ID', proId);
        this.updateExistingPro(proId, newPro);
      } else {
        console.log('Adding new pro: ', newPro)
        newProsToAdd.push(newPro);
      }
    });
    cons.forEach((newCon, index: number)=> {
      console.log('Processing con at index', index, ':', newCon);
      const originalCon = this.originalConData[index];
      const conId = originalCon ? originalCon.id : null;
      
      if(conId){
        console.log('Updating existing con with ID', conId);
        this.updateExistingCon(conId, newCon);
      } else {
        console.log('Adding new con: ', newCon)
        newConsToAdd.push(newCon);
      }
    });
    if (newProsToAdd.length > 0){
      console.log('Creating new pro:', newProsToAdd);
      this.createNewPro(newProsToAdd);
    }
    if (newConsToAdd.length > 0){
      console.log('Creating new con:', newConsToAdd);
      this.createNewCon(newConsToAdd);
    }
  }

  private updateExistingPro(proId: number, newPro: ProConItem) : void {
    this.decisionService.updateProCon(this.decisionId!, this.currentOption.id, proId, newPro).subscribe(response => {
      console.log("Successfully updated pro", response);
    },
    error => {
      console.log("Failed to update pro", error);
    }
    );
  }
  private updateExistingCon(conId: number, newCon: ProConItem) : void {
    this.decisionService.updateProCon(this.decisionId!, this.currentOption.id, conId, newCon).subscribe(response => {
      console.log("Successfully updated con", response);
    },
    error => {
      console.log("Failed to update con", error);
    }
    );
  }

  createNewPro(pros: ProConItem[]): void {
    pros.forEach(pro => {
      this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, pro, pro.criteria!).subscribe(response => {
        console.log("Successfully added new pro", response);
      }, error => { 
        console.log("Failed to add new pro", error);
     });
    });
  }

  createNewCon(cons: ProConItem[]): void {
    cons.forEach(con => {
      this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, con, con.criteria!).subscribe(response => {
        console.log("Successfully added new con", response);
      }, error => {
        console.log("Failed to add new con", error);
      });
    });
  }

  moveToNextOption() {
    if (this.currentIndex < this.options.length - 1) {
      this.currentIndex++;
      this.currentOption = this.options[this.currentIndex];
      this.proConForm.reset();
      // Clear out the FormArrays for pros and cons
      while (this.pros.length) {
        this.pros.removeAt(0);
      }
      while (this.cons.length) {
        this.cons.removeAt(0);
      }
      if (this.currentOption && this.currentOption.id) {
        this.fetchProsAndCons(this.currentOption.id);
      }
    } else {
      // If there are no more options left.
      console.log("All options covered!");
      // Navigate to summary page
      this.router.navigate(['/decisions/create/step5']);
    }
  }
  
}
