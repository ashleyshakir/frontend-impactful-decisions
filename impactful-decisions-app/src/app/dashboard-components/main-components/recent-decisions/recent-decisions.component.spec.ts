import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentDecisionsComponent } from './recent-decisions.component';

describe('RecentDecisionsComponent', () => {
  let component: RecentDecisionsComponent;
  let fixture: ComponentFixture<RecentDecisionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecentDecisionsComponent]
    });
    fixture = TestBed.createComponent(RecentDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
