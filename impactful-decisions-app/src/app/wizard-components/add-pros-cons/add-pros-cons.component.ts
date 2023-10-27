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
import { MatDialog } from '@angular/material/dialog';
import { ProConDialogComponent } from 'src/app/dialog-components/pro-con-dialog/pro-con-dialog.component';

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
              private router : Router, 
              public dialog: MatDialog) { }

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

    if (!localStorage.getItem('hasSeenExplanationDialog')) {
      this.openDialog();
    }
  
    // Load existing form data from the service
    // this.formService.loadFormDataFromLocalStorage();
    // const storedData = this.formService.getFormData();
    // console.log("stored data: ", storedData)
    // if (storedData && storedData.pros && storedData.cons) {
    //   this.proConForm.patchValue(storedData);
    // } 

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
  openDialog(): void {
    const dialogRef = this.dialog.open(ProConDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(() => {
      localStorage.setItem('hasSeenExplanationDialog', 'true');
    });
  }

  private clearExistingProCons(): void {
    while (this.pros.length) {
      this.pros.removeAt(0);
    }
    while (this.cons.length) {
      this.cons.removeAt(0);
    }
  }
  private addProConsToForm(pros: ProConItem[], cons: ProConItem[]): void {
    pros.forEach((pro: ProConItem) => {
      this.pros.push(this.createPro(pro.description, pro.rating, pro.criteriaName));
    });
    cons.forEach((con: ProConItem) => {
      this.cons.push(this.createCon(con.description, con.rating, con.criteriaName));
    });
  }
  private handleNewDecision(formData: any): void {
    if((formData && formData.pros && Array.isArray(formData.pros)) || (formData  && formData.cons && Array.isArray(formData.cons))) {
      this.clearExistingProCons();
      this.addProConsToForm(formData.pros, formData.cons);
    }
  }
  private handleExistingDecision(decisionId: number): void {
    this.fetchOptions();
  }

  fetchOptions(): void {
    this.decisionService.getDecisionOptions(this.decisionId!).subscribe(response => {
      this.options = response.data;
      // this.options = Array.isArray(response.data) ? response.data : [];
      this.currentOption = this.options[this.currentIndex];

      // Fetch pros and cons for the current option
      if (this.currentOption && this.currentOption.id) {
        this.fetchProsAndCons(this.currentOption.id);
        this.fetchCriteria();
      }
    }, error => {
      // console.log(error.message);
    });
  }

  fetchCriteria(): void {
    this.decisionService.getDecisionCriteria(this.decisionId!).subscribe(response => {
      this.criteria = response.data;
      // this.criteria = Array.isArray(response.data) ? response.data : [];
    }, error => {
      // console.log(error.message);
    });
  }

  fetchProsAndCons(optionId: number): void {
    this.decisionService.getProsAndConsForOption(this.decisionId!, optionId).subscribe(response => {
      if (response.data && Array.isArray(response.data)) {
        this.isNewDecision = false;
        this.clearExistingProCons();
        const fetchedProCons = response.data;
        const fetchedPros = fetchedProCons.filter((item: any) => item.type === 'pro');
        this.originalProData = [...fetchedPros];
        const fetchedCons = fetchedProCons.filter((item: any) => item.type === 'con');
        this.originalConData = [...fetchedCons];
        this.addProConsToForm(fetchedPros, fetchedCons);
      }
    }, error => {
      // console.log('Error fetching pros and cons:', error.message);
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
      // console.log(response);
    }, error => {
      // console.log(error);
    });
  }

  removeCon(index: number) {
    this.cons.removeAt(index);
    this.decisionService.deleteProCon(this.decisionId!, this.currentOption!.id!, this.originalConData[index].id!).subscribe(response => {
      // console.log(response);
    }, error => {
      // console.log(error);
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
      this.formService.updateFormData(proConFormData);
    // If it is an existing decision update the existing pros and cons
    } else {
      this.updateAndAddProConsForExistingDecision(pros, cons);
      this.moveToNextOption();
      this.formService.updateFormData(proConFormData);
    }
  }

  saveProConsforNewDecision(pros: ProConItem[], cons: ProConItem[]): void {
    if (this.decisionId){
      pros.forEach(pro => {
        this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, pro, pro.criteria!).subscribe(response => {
          // console.log(response);
        }, error => { 
          // console.log(error);
       });
      });
      cons.forEach(con => {
        this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, con, con.criteria!).subscribe(response => {
          // console.log(response);
        }, error => {
          // console.log(error);
        });
      });
    } 
  }

  updateAndAddProConsForExistingDecision(pros: ProConItem[], cons: ProConItem[]) : void {
    const newProsToAdd: ProConItem[] = [];
    const newConsToAdd: ProConItem[] = [];

    pros.forEach((newPro, index: number) => {
      const originalPro = this.originalProData[index];
      const proId = originalPro ? originalPro.id : null;

      if (proId && Array.isArray(this.currentOption.proConList) && this.currentOption.proConList.length > 0){
        this.updateExistingPro(proId, newPro);
      } else {
        newProsToAdd.push(newPro);
      }
    });
    cons.forEach((newCon, index: number)=> {
      const originalCon = this.originalConData[index];
      const conId = originalCon ? originalCon.id : null;
      
      if(conId && Array.isArray(this.currentOption.proConList) && this.currentOption.proConList.length > 0){
        this.updateExistingCon(conId, newCon);
      } else {
        newConsToAdd.push(newCon);
      }
    });
    if (newProsToAdd.length > 0){
      this.createNewPro(newProsToAdd);
    }
    if (newConsToAdd.length > 0){
      this.createNewCon(newConsToAdd);
    }
  }

  private updateExistingPro(proId: number, newPro: ProConItem) : void {
    this.decisionService.updateProCon(this.decisionId!, this.currentOption.id, proId, newPro, newPro.criteria!).subscribe(response => {
      // console.log("Successfully updated pro", response);
    },
    error => {
      // console.log("Failed to update pro", error);
    }
    );
  }
  private updateExistingCon(conId: number, newCon: ProConItem) : void {
    this.decisionService.updateProCon(this.decisionId!, this.currentOption.id, conId, newCon, newCon.criteria!).subscribe(response => {
      // console.log("Successfully updated con", response);
    },
    error => {
      // console.log("Failed to update con", error);
    }
    );
  }

  createNewPro(pros: ProConItem[]): void {
    pros.forEach(pro => {
      this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, pro, pro.criteria!).subscribe(response => {
        // console.log("Successfully added new pro", response);
      }, error => { 
        // console.log("Failed to add new pro", error);
     });
    });
  }

  createNewCon(cons: ProConItem[]): void {
    cons.forEach(con => {
      this.decisionService.addProConToOption(this.decisionId!, this.currentOption.id!, con, con.criteria!).subscribe(response => {
        // console.log("Successfully added new con", response);
      }, error => {
        // console.log("Failed to add new con", error);
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
      // If there are no more options left, navigate to summary page
      this.router.navigate(['/decisions/create/step5']);
    }
  }
  
}
