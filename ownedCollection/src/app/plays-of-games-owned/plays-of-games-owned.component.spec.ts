import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaysOfGamesOwnedComponent } from './plays-of-games-owned.component';

describe('PlaysOfGamesOwnedComponent', () => {
  let component: PlaysOfGamesOwnedComponent;
  let fixture: ComponentFixture<PlaysOfGamesOwnedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaysOfGamesOwnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaysOfGamesOwnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
