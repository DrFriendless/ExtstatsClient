import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeastLovedComponent } from './least-loved.component';

describe('LeastLovedComponent', () => {
  let component: LeastLovedComponent;
  let fixture: ComponentFixture<LeastLovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeastLovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeastLovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
