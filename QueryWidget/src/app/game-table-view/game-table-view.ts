import {View, ViewComponent} from "../view-mode";
import {GameTableViewComponent} from "./game-table-view.component";
import {Row} from "../app.component";
import {Injectable} from "@angular/core";
import {ExtstatsApi} from "extstats-api";

export interface GameResult extends Row {
  bggRanking: number;
  bggRating: number;
  yearPublished: number;
  weight: number;
  minPlayers: number;
  maxPlayers: number;
  playerCount: string;
}
export interface GamesResult {
  games: GameResult[];
}

@Injectable({ providedIn: 'root' })
export class GameTableView extends View {
  constructor(private api: ExtstatsApi) {
    super({ key: "games", description: "Games" });
  }

  protected buildQuery(selector: string, geek: string | undefined): string {
      return `{games(selector: "${selector}", vars: [{name: "ME", value: "${geek}"}]) { bggid name bggRanking bggRating yearPublished weight minPlayers maxPlayers } }`;
  }

  async refresh(selector: string, geek: string | undefined, view: ViewComponent, controls: ViewComponent): Promise<void> {
    view.setLoading(true);
    const s = selector.replaceAll('"', '\\"');
    const query = this.buildQuery(s, geek);
    const data = await this.api.retrieve(query);
    const d = data as GamesResult;
    for (const g of d.games) {
      g.playerCount = (g.minPlayers === g.maxPlayers) ? g.minPlayers.toString() : `${g.minPlayers}-${g.maxPlayers}`;
    }
    view.setLoading(false);
    view.setData(data as GamesResult);
  }

  getComponent() {
      return GameTableViewComponent;
  }

  getControlsComponent(): any {
    return undefined;
  }
}
