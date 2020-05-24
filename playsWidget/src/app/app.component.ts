import { Component, OnInit } from '@angular/core';
import { GraphQuerySourceComponent, UserDataService } from "extstats-angular";
import { HttpClient } from "@angular/common/http";
import {YMD} from "./library";

export interface GameData {
  bggid: number;
  name: string;
  subdomain: string;
}
export interface PlayData extends YMD {
  game: number;
  quantity: number;
}
export interface PlaysData {
  games: GameData[];
  plays: PlayData[];
}
export interface Result {
  plays: PlaysData;
}

@Component({
  selector: 'plays-widget',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class PlaysWidget extends GraphQuerySourceComponent<Result> implements OnInit {
  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.refresh();
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  protected buildQuery(geek: string): string {
    const geeks = `"${geek}"`;
    return `{plays(geeks: [${geeks}]) { games { bggid name subdomain } plays { game year month day quantity } } }`;
  }
}
