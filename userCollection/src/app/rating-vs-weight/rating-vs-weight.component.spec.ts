import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingVsWeightComponent } from './rating-vs-weight.component';

describe('RatingVsWeightComponent', () => {
  let component: RatingVsWeightComponent;
  let fixture: ComponentFixture<RatingVsWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingVsWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingVsWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
