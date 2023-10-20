import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProsConsComponent } from './add-pros-cons.component';

describe('AddProsConsComponent', () => {
  let component: AddProsConsComponent;
  let fixture: ComponentFixture<AddProsConsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProsConsComponent]
    });
    fixture = TestBed.createComponent(AddProsConsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
