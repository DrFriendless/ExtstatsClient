import {Component, effect, signal, WritableSignal} from '@angular/core';
import {LoaderComponent, UserConfigService} from "extstats-angular";
import {ExtstatsApi} from "extstats-api";
import {QueryResultsComponent} from "./query-results/query-results.component";

export interface Row {
  bggid: number;
  name: string;
}
// these types are the shape of the data returned by the GraphQL query.
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
export interface GeekGameResult extends Row {
  rating: number;
  wantInTrade: boolean;
  wantToPlay: boolean;
  wantToBuy: boolean;
  owned: boolean;
  game: {
    name: string;
  }
}
export interface GeekGamesResult {
  geekgames: {
    geekGames: GeekGameResult[];
  }
}

export type QueryMode = 'games' | 'geekgames';

@Component({
  selector: 'query-widget',
  templateUrl: './app.component.html',
  imports: [
    LoaderComponent,
    QueryResultsComponent,
  ]
})
export class QueryWidget {
  loading = signal<boolean>(false);
  mode = signal<QueryMode>('games');
  selector = signal<string | undefined>(undefined);
  gameResults = signal<GamesResult>({ games: [] });
  geekGameResults = signal<GeekGamesResult>({ geekgames: { geekGames: [] }});
  results: WritableSignal<Row[]> = signal<Row[]>([]);

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
    const url = URL.parse(window.location.href);
    if (url) {
      const params = url.searchParams;
      const m = params.get('mode');
      if (m && (m === "games" || m === "geekgames")) this.mode.set(m);
      const s = params.get('selector');
      if (s) this.selector.set(s);
    }
    effect(async () => {
      const s = this.selector();
      const mode = this.mode();
      if (!s) return;
      console.log("running", s, mode);
      await this.run(s, mode);
    });
    effect(() => {
      const g = this.gameResults();
      const gg = this.geekGameResults();
      const m = this.mode();
      switch (m) {
        case "games": {
          this.results.set(g.games);
          break;
        }
        case "geekgames": {
          this.results.set(gg.geekgames.geekGames);
          break;
        }
      }
    });
  }

  protected buildQuery(selector: string, mode: QueryMode): string {
    const geek = this.userService.getAGeek();
    switch (mode) {
      case 'games':
        return `{games(selector: "${selector}", vars: [{name: "ME", value: "${geek}"}]) { bggid name bggRanking bggRating yearPublished weight minPlayers maxPlayers } }`;
      case 'geekgames':
        return `{geekgames(selector: "${selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
          " geekGames { bggid rating owned wantInTrade wantToPlay wantToBuy game { name }}}}";
    }
  }

  async run(selector: string, mode: QueryMode) {
    const s = selector.replaceAll('"', '\\"');
    const query = this.buildQuery(s, mode);
    this.loading.set(true);
    const data = await this.api.retrieve(query);
    this.loading.set(false);
    switch (mode) {
      case 'games': {
        const d = data as GamesResult;
        for (const g of d.games) {
          g.playerCount = (g.minPlayers === g.maxPlayers) ? g.minPlayers.toString() : `${g.minPlayers}-${g.maxPlayers}`;
        }
        this.gameResults.set(data as GamesResult);
        this.geekGameResults.set({ geekgames: { geekGames: [] } });
        break;
      }
      case 'geekgames': {
        const d = data as GeekGamesResult;
        for (const gg of d.geekgames.geekGames) gg.name = gg.game.name;
        this.gameResults.set({ games: [] });
        this.geekGameResults.set(data as GeekGamesResult);
        break;
      }
    }
  }
}
