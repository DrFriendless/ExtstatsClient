import { Component, OnInit, ViewChild } from "@angular/core"
import { GeekChipsComponent, UserDataService } from "extstats-angular"
import { HttpClient, HttpParams } from "@angular/common/http";
import { GraphQuerySourceComponent } from "./graph-query-source/graph-query-source.component";
import { GameData } from "extstats-core"

export interface HasYMD {
  ymd: number;
}
export interface PlayData extends HasYMD {
  geek: string;
  game: number;
  year?: number;
  month?: number;
  date?: number;
}
export interface PlaysData {
  games: GameData[];
  geeks: string[];
  plays: PlayData[];
}
export interface Result {
  plays: PlaysData;
}

@Component({
  selector: 'multiplays-widget',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class MultiPlaysWidget extends GraphQuerySourceComponent<Result> implements OnInit {
  @ViewChild('chips') chips: GeekChipsComponent;
  public geeks: string[] = [];

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService);
  }

  public ngOnInit() {
    super.ngOnInit();
    const gs = MultiPlaysWidget.getParamValueQueryString("geeks");
    if (gs) {
      this.geeks = gs.split(",").map(s => s.trim()).filter(s => !!s);
    }
    this.refresh();
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  public apply(): void {
    window.location.search = "geeks=" + this.geeks.join(",");
  }

  protected buildQuery(geek: string): string {
    if (this.geeks.length) {
      const geeks = this.geeks.map(g => `"${g}"`).join(", ");
      return `{plays(geeks: [${geeks}], first: true) { geeks games { bggid name } plays { game ymd geek } } }`;
    } else if (geek) {
      const geeks = `"${geek}"`;
      return `{plays(geeks: [${geeks}], first: true) { geeks games { bggid name } plays { game ymd geek } } }`;
    } else {
      return "";
    }
  }

  private static getParamValueQueryString(paramName: string): string {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }
}
