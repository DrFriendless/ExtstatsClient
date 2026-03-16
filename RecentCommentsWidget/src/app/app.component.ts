import {AfterViewInit, Component} from '@angular/core';
import {BlogComment, ExtstatsApi} from "extstats-api";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'extstats-recent-comments',
  imports: [
    DatePipe
  ],
  templateUrl: './app.component.html'
})
export class RecentCommentsWidget implements AfterViewInit {
  comments: BlogComment[] = [];

  constructor(private api: ExtstatsApi) {
  }

  async ngAfterViewInit(): Promise<void> {
      await this.refresh();
  }

  private async refresh() {
    this.comments = await this.api.retrieveRecentComments();
  }
}
