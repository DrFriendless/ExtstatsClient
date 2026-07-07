import {View, ViewComponent} from "../view-mode";
import {Row} from "../app.component";
import {GeekGameTableViewComponent} from "./geekgame-table-view.component";
import {Injectable} from "@angular/core";
import {ExtstatsApi} from "extstats-api";


export interface GeekGameResult extends Row {
  rating: number;
  wantInTrade: boolean;
  wantToPlay: boolean;
  wantToBuy: boolean;
  owned: boolean;
  game: {
    name: string;
  }
  forTrade: boolean;
}

export interface GeekGamesResult {
  geekgames: {
    geekGames: GeekGameResult[];
  }
}

@Injectable({ providedIn: 'root' })
export class GeekGameTableView extends View {
  constructor(private api: ExtstatsApi) {
    super({ key: "geekgames", description: "Geek Games" });
  }

  protected buildQuery(selector: string, geek: string | undefined): string {
    return `{geekgames(selector: "${selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " geekGames { bggid rating owned wantInTrade wantToPlay wantToBuy forTrade game { name }}}}";
  }

  async refresh(selector: string, geek: string | undefined, view: ViewComponent, controls: ViewComponent): Promise<void> {
    view.setLoading(true);
    const s = selector.replaceAll('"', '\\"');
    const query = this.buildQuery(s, geek);
    const data = await this.api.retrieve(query);
    const d = data as GeekGamesResult;
    for (const gg of d.geekgames.geekGames) {
      gg.name = gg.game.name;
    }
    view.setLoading(false);
    view.setData(data as GeekGamesResult);
  }

  getComponent() {
    return GeekGameTableViewComponent;
  }

  getControlsComponent(): any {
    return undefined;
  }
}
