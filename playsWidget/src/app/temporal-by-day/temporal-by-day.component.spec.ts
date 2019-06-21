import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalByDayComponent } from './temporal-by-day.component';

describe('TemporalByDayComponent', () => {
  let component: TemporalByDayComponent;
  let fixture: ComponentFixture<TemporalByDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporalByDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporalByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
