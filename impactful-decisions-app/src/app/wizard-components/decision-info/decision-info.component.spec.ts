import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionInfoComponent } from './decision-info.component';

describe('DecisionInfoComponent', () => {
  let component: DecisionInfoComponent;
  let fixture: ComponentFixture<DecisionInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionInfoComponent]
    });
    fixture = TestBed.createComponent(DecisionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
