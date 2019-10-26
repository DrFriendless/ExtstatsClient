import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaysOfGamesOwnedByPublishedYearComponent } from './plays-of-games-owned-by-published-year.component';

describe('PlaysOfGamesOwnedByPublishedYearComponent', () => {
  let component: PlaysOfGamesOwnedByPublishedYearComponent;
  let fixture: ComponentFixture<PlaysOfGamesOwnedByPublishedYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaysOfGamesOwnedByPublishedYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaysOfGamesOwnedByPublishedYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
