import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardContainerComponent } from './wizard-container.component';

describe('WizardContainerComponent', () => {
  let component: WizardContainerComponent;
  let fixture: ComponentFixture<WizardContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WizardContainerComponent]
    });
    fixture = TestBed.createComponent(WizardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});