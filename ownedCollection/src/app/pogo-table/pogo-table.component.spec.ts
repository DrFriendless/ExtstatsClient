import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PogoTableComponent } from './pogo-table.component';

describe('PogoTableComponent', () => {
  let component: PogoTableComponent;
  let fixture: ComponentFixture<PogoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PogoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PogoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
