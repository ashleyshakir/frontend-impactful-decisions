import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaDialogComponent } from './criteria-dialog.component';

describe('CriteriaDialogComponent', () => {
  let component: CriteriaDialogComponent;
  let fixture: ComponentFixture<CriteriaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaDialogComponent]
    });
    fixture = TestBed.createComponent(CriteriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
