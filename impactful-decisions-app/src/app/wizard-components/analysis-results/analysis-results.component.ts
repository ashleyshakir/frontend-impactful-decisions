import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { DecisionService } from 'src/app/services/decision.service';
import { FormService } from 'src/app/services/form.service';
import { Decision } from 'src/app/models/decsion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis-results',
  templateUrl: './analysis-results.component.html',
  styleUrls: ['./analysis-results.component.scss']
})
export class AnalysisResultsComponent implements OnInit {
  recommendedOption : string = '';
  decisionId!: number | null;
  decision!: Decision;

  constructor(private decisionService: DecisionService, 
              private formService: FormService,
              private router: Router) { }

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000
    },
    plugins: {
      tooltip: {
        enabled: true, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Background color of the tooltip
        titleFont: { size: 16, weight: 'bold', family: 'Lato' },
        bodyFont: { size: 14, family: 'Lato' },
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            return `${value}%`;
          }
        }
      },
    }
  };

  public pieChartLabels: string[] = ['Option 1', 'Option 2'];
  public pieChartDatasets = [ {
    data: [ 33.33, 66.67 ],
    backgroundColor: [
      'rgb(255, 153, 32)',
      'rgb(89, 216, 229)',
      'rgb(136, 233, 194)',
      'rgb(255, 220, 113)',
    ],
    hoverOffset: 4
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  ngOnInit(): void {

    // Try retrieving recommendedOption and pie chart data from localStorage
    this.recommendedOption = localStorage.getItem('recommendedOption') || '';

    const storedLabels = localStorage.getItem('pieChartLabels');
    const storedDatasetsData = localStorage.getItem('pieChartDatasetsData');

    if (storedLabels && storedDatasetsData) {
        this.pieChartLabels = JSON.parse(storedLabels);
        this.pieChartDatasets[0].data = JSON.parse(storedDatasetsData);
    }
    // Retrieve decisionId from localStorage
    const storedDecisionId = localStorage.getItem('decisionId');
    this.decisionId = storedDecisionId ? +storedDecisionId : null;

    // Subscribe to form data to get the decisionId
    this.formService.formData$.subscribe(data => {
      this.decisionId = data.decisionId;

      // Save to localStorage
      if (this.decisionId !== undefined && this.decisionId !== null) {
        localStorage.setItem('decisionId', this.decisionId.toString());
      }
      
    });

    if(this.decisionId){
      this.decisionService.getDecisionDetails(this.decisionId!).subscribe(response =>{
        this.decision = response.data;
      });
    }

    this.updateChartData()
  }

  updateChartData() {
    if (this.decisionId){
      this.decisionService.analyzeDecision(this.decisionId).subscribe(results => {
        const optionIds = Object.keys(results.optionScores);
        const scores = Object.values(results.optionScores) as number[];
  
        // Calculate the total
        const total = scores.reduce((acc, value) => acc + value, 0);
  
        // Convert scores to percentages
        const percentages = scores.map(score => Math.round(((score / total) * 100) * 100) / 100);
  
        this.pieChartLabels = optionIds;
        this.pieChartDatasets = [{ data: percentages, backgroundColor: ['rgb(255, 153, 32)', 'rgb(89, 216, 229)', 'rgb(136, 233, 194)', 'rgb(255, 220, 113)' ], hoverOffset: 4 }];
        this.recommendedOption = results.recommendedOption.name;

        localStorage.setItem('recommendedOption', this.recommendedOption);

        // Saving pie chart data to localStorage
        localStorage.setItem('pieChartLabels', JSON.stringify(this.pieChartLabels));
        localStorage.setItem('pieChartDatasetsData', JSON.stringify(this.pieChartDatasets[0].data));
  
      })
    }
  }

  resolveDecision(){
    if(this.decision.resolved){
      this.decision.resolved = false;
    } else {
      this.decision.resolved = true;
    }
    this.decisionService.updateDecision(this.decision).subscribe(decision => {
      this.decision = decision.data;
    });
  }
  
  navigateToDashboard() {
    this.formService.clearOtherData();
    this.router.navigate(['/dashboard']);
  }
}
