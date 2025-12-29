import { Component, OnInit, ViewChild } from "@angular/core"
import {
  GeekChipsComponent,
  GeekComboComponent,
  GraphQuerySourceComponent,
  LoaderComponent,
  UserDataService
} from "extstats-angular"
import { HttpParams } from "@angular/common/http";
import { GameData } from "extstats-core"
import {ExtstatsApi} from "extstats-api";
import {NewPlaysComponent} from "./new-plays/new-plays.component";
import {window} from "ngx-bootstrap/utils";

export interface HasYMD {
  ymd: number;
}
export interface PlayData extends HasYMD {
  geek: string;
  game: { bggid: number };
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
  imports: [
    LoaderComponent,
    GeekComboComponent,
    GeekChipsComponent,
    NewPlaysComponent
  ]
})
export class MultiplaysWidget extends GraphQuerySourceComponent<Result> implements OnInit {
  @ViewChild('chips') chips!: GeekChipsComponent;
  public geeks: string[] = [];

  constructor(api: ExtstatsApi, private userDataService: UserDataService) {
    super(api);
  }

  ngOnInit() {
    const gs = MultiplaysWidget.getParamValueQueryString("geeks");
    if (gs) {
      this.geeks = gs.split(",").map(s => s.trim()).filter(s => !!s);
    }
    this.refresh();
  }

  public apply(): void {
    window.location.search = "geeks=" + this.geeks.join(",");
  }

  protected buildQuery(): string {
    if (this.geeks.length) {
      const geeks = this.geeks.map(g => `"${g}"`).join(", ");
      return `{plays(geeks: [${geeks}], first: true) { geeks games { bggid name } plays { game { bggid } ymd geek } } }`;
    } else {
      const geek = this.userDataService.getAGeek();
      if (geek) {
        const geeks = `"${geek}"`;
        return `{plays(geeks: [${geeks}], first: true) { geeks games { bggid name } plays { game { bggid } ymd geek } } }`;
      } else {
        console.log("no geek");
        return "";
      }
    }
  }

  private static getParamValueQueryString(paramName: string): string | null | undefined {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }
}
