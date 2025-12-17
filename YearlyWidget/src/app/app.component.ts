import {Component, OnInit} from '@angular/core';
import {GraphQuerySourceComponent, LoaderComponent, UserDataService} from "extstats-angular";
import {YearChooserComponent} from "./year-chooser/year-chooser.component";
import {YearlyBestDaysComponent} from "./yearly-best-days/yearly-best-days.component";
import {NickelAndDimeComponent} from "./nickel-and-dime/nickel-and-dime.component";
import {MikeHulsebusComponent} from "./mike-hulsebus/mike-hulsebus.component";
import {ExtstatsApi} from "extstats-api";

export interface GameId {
  bggid: number;
}

export interface Game {
  bggid: number;
  name: string;
  isExpansion: boolean;
}
export interface Plays {
  game: GameId;
  quantity: number;
  ymd: number;
}
export interface GeekGame {
  rating: number;
  bggid: number;
}
export interface Data {
  games: Game[];
  geeks: string[];
  plays: Plays[];
  geekgames: GeekGame[];
}
export interface Result {
  plays: Data;
}

@Component({
  selector: 'yearly-widget',
  templateUrl: './app.component.html',
  imports: [
    YearChooserComponent,
    LoaderComponent,
    YearlyBestDaysComponent,
    NickelAndDimeComponent,
    MikeHulsebusComponent
  ],
  styleUrls: ['./app.component.scss']
})
export class YearlyComponent extends GraphQuerySourceComponent<Result> implements OnInit {
  years: number[] = [];
  year = new Date().getFullYear();

  constructor(api: ExtstatsApi, userDataService: UserDataService) {
    super(api, userDataService);
  }

  setYear(year: number) {
    console.log(`setYear ${year}`);
    this.year = year;
    this.refresh();
  }

  override async ngOnInit() {
    await super.ngOnInit();
    this.years = (await this.getYears()).years;
    this.year = (this.years.length) ? this.years[this.years.length-1] : new Date().getFullYear();
  }

  private async getYears(): Promise<{ years: number[] }> {
    return await this.api.retrieve(`{years(geek: "${this.geek}")}`) as { years: number[] };
  }

  protected buildQuery(geek: string): string {
    let q: string;
    if (geek) {
      const s = this.year * 10000;
      const e = this.year * 10000 + 1231;
      q = `{plays(geeks: ["${geek}"], startYMD: ${s}, endYMD: ${e}) { geeks games { bggid name isExpansion } plays { game { bggid } quantity ymd } geekgames { bggid rating } } }`;
    } else {
      q = "";
    }
    console.log(q);
    return q;
  }
}
