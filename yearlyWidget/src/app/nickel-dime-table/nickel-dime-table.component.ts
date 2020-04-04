import {Component, Input} from '@angular/core';
import {Row} from "../nickel-and-dime/nickel-and-dime.component";

@Component({
  selector: 'nickel-dime-table',
  templateUrl: './nickel-dime-table.component.html',
  styleUrls: ['./nickel-dime-table.component.scss']
})
export class NickelDimeTableComponent {
  @Input('') data: Row[] = [];
  @Input('') title: string = "";
}
