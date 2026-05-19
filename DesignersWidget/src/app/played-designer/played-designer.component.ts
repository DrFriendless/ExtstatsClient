import {
  AfterViewInit,
  Component, computed,
  effect, model,
  signal,
  Signal,
  TemplateRef,
  viewChild,
  WritableSignal
} from '@angular/core';
import {
  BoardGameDesignerLinkComponent,
  BoardGameLinkComponent,
  LoaderComponent, SwitchComponent,
  UserConfigService, UserTagService
} from "extstats-angular";
import {ExtstatsApi} from "extstats-api";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead, RowContext
} from "extstats-datatable";

interface RawDesigner {
  bggid: number;
  name: string;
}

interface FullDesigner extends RawDesigner {
  gameCount: number;
  totalRatings: number;
  totalPlays: number;
}

interface RawGame {
  isExpansion: boolean;
  bggid: number;
  name: string;
  designers: RawDesigner[];
}

interface RawGeekGame {
  rating: number;
  plays: number;
  game: RawGame;
}

interface RawData {
  geekgames: {
    geekGames: RawGeekGame[];
  }
}

interface Row {
  bggid: number;
  name: string;
  rating: number;
  plays: number;
  designer: {
    bggid: number;
    name: string;
  }
  designerName: string;
  designerGameCount: number;
  designerTotalRatings: number;
  designerTotalPlays: number;
  designerAverage: number;
}

@Component({
  selector: 'played-designer',
  imports: [
    LoaderComponent,
    BoardGameLinkComponent,
    DataTable,
    DataTableBody,
    DataTableHead,
    BoardGameDesignerLinkComponent,
    DataTableController,
    SwitchComponent,
    SwitchComponent,
  ],
  templateUrl: './played-designer.component.html'
})
export class PlayedByDesignerWidget implements AfterViewInit {
  boardgame: Signal<TemplateRef<RowContext<Row>> | undefined> = viewChild('boardgame');
  designer: Signal<TemplateRef<RowContext<Row>> | undefined> = viewChild('designer');
  useExpansions = model(false);

  params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game by the designer",
      classname: "col-game-name",
      template: undefined
    },
    { field: "rating", name: "Rating", tooltip: "Your rating for this game.", classname: "col-rating",
      valueHtml: (r: Row)=> (r.rating < 1) ? "" : r.rating.toString()
    },
    { field: "plays", name: "Plays", tooltip: "The number of times you have played this game.", classname: "col-number" },
    { field: "designerName", name: "Designer", tooltip: "A designer of this game.", template: undefined, classname: "col-designer" },
    { field: "designerTotalPlays", name: "Total Plays", tooltip: "Your total plays for this designer." },
    { field: "designerAverage", name: "Average Rating", tooltip: "Your average rating for this designer.",
      valueHtml: (r: Row)=> (r.designerAverage === 0) ? "" : r.designerAverage.toString()
    },
  ];
  columns: WritableSignal<Column<Row>[]> = signal([]);

  private static DEFAULT_SELECTOR = "played(ME)";
  private selector = PlayedByDesignerWidget.DEFAULT_SELECTOR;
  loading = signal<boolean>(false);
  rawData: WritableSignal<RawData> = signal({geekgames: { geekGames: [] } });
  data = computed(() => {
    const result: Row[] = [];
    const rawData = this.rawData();
    const useExpansions = this.useExpansions();
    for (const gg of rawData.geekgames.geekGames) {
      if (useExpansions || !gg.game.isExpansion) {
        for (const rd of gg.game.designers) {
          // index designers
          const designerIndex: Record<string, FullDesigner> = {};
          for (const gg of rawData.geekgames.geekGames) {
            for (const rd of gg.game.designers) {
              if (!designerIndex.hasOwnProperty(rd.bggid.toString())) {
                designerIndex[rd.bggid.toString()] = {...rd, gameCount: 0, totalRatings: 0, totalPlays: 0 };
              }
              const d = designerIndex[rd.bggid.toString()];
              d.totalPlays += gg.plays;
              if (gg.rating > 0) {
                d.gameCount += 1;
                d.totalRatings += gg.rating;
              }
            }
          }
          const d = designerIndex[rd.bggid.toString()];
          result.push({ bggid: gg.game.bggid, name: gg.game.name, plays: gg.plays, rating: gg.rating,
            designerName: d.name,
            designer: { bggid: d.bggid, name: d.name }, designerTotalRatings: d.totalRatings, designerTotalPlays: d.totalPlays,
            designerGameCount: d.gameCount, designerAverage: (d.gameCount === 0) ? 0 : (Math.round(d.totalRatings * 100 / d.gameCount)/100) });
        }
      }
    }
    return result;
  });

  constructor(private api: ExtstatsApi, public userService: UserConfigService, public tagService: UserTagService) {
    this.userService.checkDataIsLoaded()
      .then(async () => this.useExpansions.set((await this.userService.get("options.pbd.use_expansions", false)) || false));
    effect(() => {
      this.params[0].template = this.boardgame();
      this.columns.set(this.params.map(c => new Column<Row>(c)));
    });
    effect(() => {
      this.params[3].template = this.designer();
      this.columns.set(this.params.map(c => new Column<Row>(c)));
    });
    effect(async () => {
      await this.userService.setAndSave("options.pbd.use_expansions", this.useExpansions());
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    const geek = this.userService.getAGeek();
    if (geek) {
      this.loading.set(true);
      this.rawData.set(await this.api.retrieve(this.buildQuery()) as RawData);
      this.loading.set(false);
    }
  }

  protected buildQuery(): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " geekGames { rating plays game { isExpansion bggid name designers { bggid name } } } } }";
  }
}
