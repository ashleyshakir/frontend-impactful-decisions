import { Component, OnInit } from '@angular/core';
import { DecisionService } from 'src/app/services/decision.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProCon } from 'src/app/models/procon.model';

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

  constructor(private decisionService: DecisionService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchOptions();
    this.fetchCriteria();
    this.initializeForm();
  }



  fetchOptions(): void {
    this.decisionService.getDecisionOptions().subscribe(options => {
      this.options = options.data;
      this.currentOption = this.options[this.currentIndex];
      console.log(this.currentOption)
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
    this.proConForm.valueChanges.subscribe(val => {
      console.log('Form Value:', val);
      console.log('Form Validity:', this.proConForm.valid);
  });
  
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
    console.log('Added Pro Validity:', proGroup.valid);
    this.pros.push(proGroup);
  }

  addCon() {
    const conGroup = this.fb.group({
      description: ['', Validators.required],
      rating: ['', Validators.required],
      criteria: ['', Validators.required],
      type: ['con']
    });
    console.log('Added Con Validity:', conGroup.valid);
    this.cons.push(conGroup);
  }

  removePro(index: number) {
    this.pros.removeAt(index);
  }

  removeCon(index: number) {
    this.cons.removeAt(index);
  }

  saveProsCons() {
    console.log(this.proConForm.value);  // Logs the form's current values
    console.log('Form Valid:', this.proConForm.valid); 
    const proConData = this.proConForm.value;
    if (this.proConForm.valid) {

    proConData.pros.forEach((pro : any) => {
      pro.option = this.currentOption;
      this.saveProCon(pro);
    });

    proConData.cons.forEach((con : any) => {
      con.option = this.currentOption;
      this.saveProCon(con);
    });
  }
  }

  saveProCon(proCon: any) {
    console.log("Decision ID: " + this.decisionService.decisionId);
    console.log("Option ID: " +  this.currentOption.id);
    let criteriaName = proCon.criteria;
    delete proCon.criteria;
    delete proCon.option;
    console.log("Modified proCon object: ", proCon);
    console.log("Criteria Name:", criteriaName);
    this.decisionService.addProConToOption(this.decisionService.decisionId!, this.currentOption.id, proCon, criteriaName)
      .subscribe(response => {
        console.log("ProCon saved: ", response.data);
        if (proCon.type === 'con' && proCon === this.proConData.cons[this.proConData.cons.length - 1]) {
          this.moveToNextOption();
        }
      }, error => {
        console.error('Error saving ProCon:', error.message);
      })
  }


  moveToNextOption() {
    console.log("switching to next option")
    if (this.currentIndex < this.options.length - 1) {
      this.currentIndex++;
      this.currentOption = this.options[this.currentIndex];
      this.proConForm.reset();
      // If you wish to start with default pro/con fields for every option:
      this.addPro();
      this.addCon();
    } else {
      // If there are no more options left.
      console.log("All options covered!");
      // Here, you can navigate the user to another page or display a completion message.
    }
  }
  
}
