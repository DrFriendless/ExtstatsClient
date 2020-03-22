import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'year-chooser',
  templateUrl: './year-chooser.component.html',
  styleUrls: ['./year-chooser.component.scss']
})
export class YearChooserComponent {
  @Input('years') years: number[] = [];
  @Input('selected') selected: number;
  @Output('year') year = new EventEmitter<number>();

  emit(y: number) {
    this.year.emit(y);
  }
}
