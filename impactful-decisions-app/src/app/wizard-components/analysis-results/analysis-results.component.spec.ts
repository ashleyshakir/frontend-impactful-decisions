import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisResultsComponent } from './analysis-results.component';

describe('AnalysisResultsComponent', () => {
  let component: AnalysisResultsComponent;
  let fixture: ComponentFixture<AnalysisResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalysisResultsComponent]
    });
    fixture = TestBed.createComponent(AnalysisResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
