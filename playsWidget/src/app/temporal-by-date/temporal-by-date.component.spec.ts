import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalByDateComponent } from './temporal-by-date.component';

describe('TemporalByDateComponent', () => {
  let component: TemporalByDateComponent;
  let fixture: ComponentFixture<TemporalByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporalByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporalByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
