import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { DecisionService } from 'src/app/services/decision.service';

@Component({
  selector: 'app-analysis-results',
  templateUrl: './analysis-results.component.html',
  styleUrls: ['./analysis-results.component.scss']
})
export class AnalysisResultsComponent implements OnInit {
  recommendedOption : string = '';

  constructor(private decisionService: DecisionService) { }

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
    this.updateChartData()
  }

  updateChartData() {
    this.decisionService.analyzeDecision().subscribe(results => {
      console.log(results);
      const optionIds = Object.keys(results.optionScores);
      const scores = Object.values(results.optionScores) as number[];

      // Calculate the total
      const total = scores.reduce((acc, value) => acc + value, 0);

      // Convert scores to percentages
      const percentages = scores.map(score => Math.round(((score / total) * 100) * 100) / 100);

      this.pieChartLabels = optionIds;
      this.pieChartDatasets = [{ data: percentages, backgroundColor: ['rgb(255, 153, 32)', 'rgb(89, 216, 229)', 'rgb(136, 233, 194)', 'rgb(255, 220, 113)' ], hoverOffset: 4 }];
      this.recommendedOption = results.recommendedOption.name;

    })

  }







}
