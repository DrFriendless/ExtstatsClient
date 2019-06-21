import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalByMonthComponent } from './temporal-by-month.component';

describe('TemporalByMonthComponent', () => {
  let component: TemporalByMonthComponent;
  let fixture: ComponentFixture<TemporalByMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporalByMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporalByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
