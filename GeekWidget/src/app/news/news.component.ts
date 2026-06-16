import { Component, AfterViewInit } from '@angular/core';
import {ExtstatsApi, NewsItem} from "extstats-api";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'extstats-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  imports: [
    DatePipe
  ],
  standalone: true
})
export class NewsComponent implements AfterViewInit {
  public data: NewsItem[] = [];

  public constructor(private api: ExtstatsApi) { }

  public async ngAfterViewInit() {
    this.data = await this.api.getNews();
  }
}
