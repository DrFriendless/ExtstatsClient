import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YouShouldPlayComponent } from './you-should-play.component';

describe('YouShouldPlayComponent', () => {
  let component: YouShouldPlayComponent;
  let fixture: ComponentFixture<YouShouldPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YouShouldPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YouShouldPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
