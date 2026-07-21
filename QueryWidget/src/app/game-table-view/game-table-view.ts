import {View, ViewComponent} from "../view-mode";
import {GameTableViewComponent} from "./game-table-view.component";
import {Row} from "../app.component";
import {Injectable} from "@angular/core";
import {ExtstatsApi} from "extstats-api";

export interface GameTableRow extends Row {
  bggRanking: number;
  bggRating: number;
  yearPublished: number;
  weight: number;
  minPlayers: number;
  maxPlayers: number;
  playerCount: string;
}

export interface GameResult {
  bggid: number;
  tags: string[];
  game: {
    name: string;
    bggRanking: number;
    bggRating: number;
    yearPublished: number;
    weight: number;
    minPlayers: number;
    maxPlayers: number;
  }
}
export interface RawResult {
  geekgames: {
    geekGames: GameResult[]
  };
}

@Injectable({ providedIn: 'root' })
export class GameTableView extends View {
  constructor(private api: ExtstatsApi) {
    super({ key: "games", description: "Games" });
  }

  protected buildQuery(selector: string, geek: string | undefined): string {
    return `{geekgames(selector: "${selector}", vars: [{name: "ME", value: "${geek}"}]) {
        geekGames { bggid tags game { name bggRanking bggRating yearPublished weight minPlayers maxPlayers } } } }`;
  }

  async refresh(selector: string, geek: string | undefined, view: ViewComponent, controls: ViewComponent): Promise<void> {
    view.setLoading(true);
    const s = selector.replaceAll('"', '\\"');
    const query = this.buildQuery(s, geek);
    const data = await this.api.retrieve(query) as RawResult;
    const rows: GameTableRow[] = data.geekgames.geekGames.map(gg => {
      const g = gg.game;
      const playerCount = (g.minPlayers === g.maxPlayers) ? g.minPlayers.toString() : `${g.minPlayers}-${g.maxPlayers}`;
      return {
         bggid: gg.bggid, tags: gg.tags, ...g, playerCount
      }
    });
    view.setLoading(false);
    view.setData(rows);
  }

  getComponent() {
    return GameTableViewComponent;
  }

  getControlsComponent(): any {
    return undefined;
  }
}
