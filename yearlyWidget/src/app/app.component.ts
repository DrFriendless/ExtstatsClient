import {Component, OnInit} from '@angular/core';
import {GraphQuerySourceComponent, UserDataService} from "extstats-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

export interface Game {
  bggid: number;
  name: string;
  isExpansion: boolean;
}
export interface Plays {
  game: number;
  quantity: number;
}
export interface Data {
  games: Game[];
  geeks: string[];
  plays: Plays[];
}
export interface Result {
  plays: Data;
}

@Component({
  selector: 'yearly-widget',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class YearlyComponent extends GraphQuerySourceComponent<Result> implements OnInit {
  years: number[];
  year = new Date().getFullYear();

  constructor(private httpClient: HttpClient, userDataService: UserDataService) {
    super(httpClient, userDataService);
  }

  setYear(year: number) {
    this.year = year;
    super.refresh();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getYears().subscribe(data => {
      console.log(data);
      this.years = (data.data.years.length === 0) ? [new Date().getFullYear()] : data.data.years;
      this.year = this.years[this.years.length-1];
    });
  }

  private getYears(): Observable<any> {
    const options = {
      headers: new HttpHeaders().set('x-api-key', this.getApiKey())
    };
    const query = '?query=' + encodeURIComponent(`{years(geek: "${this.geek}")}`);
    return this.httpClient.get('https://api.drfriendless.com/v1/retrieve' + query, options) as Observable<any>;
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  protected buildQuery(geek: string): string {
    if (geek) {
      const s = this.year * 10000;
      const e = this.year * 10000 + 1231;
      return `{plays(geeks: ["${geek}"], startYMD: ${s}, endYMD: ${e}) { geeks games { bggid name isExpansion } plays { game quantity } } }`;
    } else {
      return "";
    }
  }
}
