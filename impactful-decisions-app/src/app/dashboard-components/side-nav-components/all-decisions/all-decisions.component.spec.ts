import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDecisionsComponent } from './all-decisions.component';

describe('AllDecisionsComponent', () => {
  let component: AllDecisionsComponent;
  let fixture: ComponentFixture<AllDecisionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllDecisionsComponent]
    });
    fixture = TestBed.createComponent(AllDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
