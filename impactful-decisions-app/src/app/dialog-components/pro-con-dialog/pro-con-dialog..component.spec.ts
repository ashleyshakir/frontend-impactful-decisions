import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProConDialogComponent } from './pro-con-dialog.component';

describe('ProConDialogComponent', () => {
  let component: ProConDialogComponent;
  let fixture: ComponentFixture<ProConDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProConDialogComponent]
    });
    fixture = TestBed.createComponent(ProConDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
