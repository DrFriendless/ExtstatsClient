import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaysByYearComponent } from './plays-by-year.component';

describe('PlaysByYearComponent', () => {
  let component: PlaysByYearComponent;
  let fixture: ComponentFixture<PlaysByYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaysByYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaysByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
