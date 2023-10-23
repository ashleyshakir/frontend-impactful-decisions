import { Component, OnInit } from '@angular/core';
import { DecisionService } from 'src/app/services/decision.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProCon } from 'src/app/models/procon.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-pros-cons',
  templateUrl: './add-pros-cons.component.html',
  styleUrls: ['./add-pros-cons.component.scss']
})
export class AddProsConsComponent implements OnInit{
  options: any[] = [];
  criteria: any[] = [];
  ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  currentOption: any = null;
  currentIndex: number = 0;
  proConData: ProCon = new ProCon();
  proConForm!: FormGroup;
  lastProSaved: boolean = false;
  lastConSaved: boolean = false;

  constructor(private decisionService: DecisionService, private fb: FormBuilder, private router : Router) { }

  ngOnInit(): void {
    this.fetchOptions();
    this.fetchCriteria();
    this.initializeForm();
  }



  fetchOptions(): void {
    this.decisionService.getDecisionOptions().subscribe(options => {
      this.options = options.data;
      this.currentOption = this.options[this.currentIndex];
    }, error => {
      console.log(error.message);
    });
  }

  fetchCriteria(): void {
    this.decisionService.getDecisionCriteria().subscribe(criteria => {
      this.criteria = criteria.data;
    }, error => {
      console.log(error.message);
    });
  }

  initializeForm() {
    this.proConForm = this.fb.group({
      pros: this.fb.array([]),
      cons: this.fb.array([])
    });
    // this.addPro();
    // this.addCon();
  
  }

  get pros(): FormArray {
    return this.proConForm.get('pros') as FormArray;
  }

  get cons(): FormArray {
    return this.proConForm.get('cons') as FormArray;
  }

  addPro() {
    const proGroup = this.fb.group({
      description: ['', Validators.required],
      rating: ['', Validators.required],
      criteria: ['', Validators.required],
      type: ['pro']
    });
    this.pros.push(proGroup);
  }

  addCon() {
    const conGroup = this.fb.group({
      description: ['', Validators.required],
      rating: ['', Validators.required],
      criteria: ['', Validators.required],
      type: ['con']
    });
    this.cons.push(conGroup);
  }

  removePro(index: number) {
    this.pros.removeAt(index);
  }

  removeCon(index: number) {
    this.cons.removeAt(index);
  }

  saveProsCons() {
    const proConFormData = this.proConForm.value;
    if (this.proConForm.valid) {

      this.proConData.pros = proConFormData.pros;
      this.proConData.cons = proConFormData.cons;

      proConFormData.pros.forEach((pro : any) => {
        pro.option = this.currentOption;
        this.saveProCon(pro);
      });

      proConFormData.cons.forEach((con : any) => {
        con.option = this.currentOption;
        this.saveProCon(con);
      });
    }
  }

  saveProCon(proCon: any) {
    let criteriaName = proCon.criteria;
    delete proCon.criteria;
    delete proCon.option;
    
    this.decisionService.addProConToOption(this.decisionService.decisionId!, this.currentOption.id, proCon, criteriaName)
      .subscribe(response => {
        if (proCon.type === 'pro' && proCon === this.proConData.pros[this.proConData.pros.length - 1]) {
          this.lastProSaved = true;
        }
        if (proCon.type === 'con' && (this.proConData.cons.length === 0 || proCon === this.proConData.cons[this.proConData.cons.length - 1])) {
          this.lastConSaved = true;
        }
        if (this.lastProSaved && this.lastConSaved) {
          this.moveToNextOption();
        }
      }, error => {
        console.error('Error saving ProCon:', error.message);
      })
  }


  moveToNextOption() {
    console.log("switching to next option")
    this.lastProSaved = false;
    this.lastConSaved = false;
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
    } else {
      // If there are no more options left.
      console.log("All options covered!");
      // Navigate to summary page
      this.router.navigate(['/decisions/create/step5']);
    }
  }
  
}
