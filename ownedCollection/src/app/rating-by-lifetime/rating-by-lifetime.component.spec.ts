import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingByLifetimeComponent } from './rating-by-lifetime.component';

describe('RatingByLifetimeComponent', () => {
  let component: RatingByLifetimeComponent;
  let fixture: ComponentFixture<RatingByLifetimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingByLifetimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingByLifetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
