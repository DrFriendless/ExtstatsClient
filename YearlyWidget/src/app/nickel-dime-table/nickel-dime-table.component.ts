import {AfterViewInit, Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {Row} from "../nickel-and-dime/nickel-and-dime.component";
import {BoardGameLinkComponent, UserTagService} from "extstats-angular";
import {Column, RowContext} from "extstats-datatable";
import {MostPlayedEntry} from "extstats-api";

@Component({
    selector: 'nickel-dime-table',
    templateUrl: './nickel-dime-table.component.html',
    imports: [
        BoardGameLinkComponent
    ],
    styleUrls: ['./nickel-dime-table.component.scss']
})
export class NickelDimeTableComponent {
  @Input('data') data: Row[] = [];
  @Input('title') title: string = "";

  constructor(public tagService: UserTagService) {
  }
}
