import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesPanelComponent } from './updates-panel.component';

describe('UpdatesPanelComponent', () => {
  let component: UpdatesPanelComponent;
  let fixture: ComponentFixture<UpdatesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
