import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {
  BoardGameDesignerLinkComponent,
  BoardGameLinkComponent,
  LoaderComponent,
  UserConfigService, UserTagService
} from "extstats-angular";
import {ExtstatsApi} from "extstats-api";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
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
  ],
  templateUrl: './played-designer.component.html'
})
export class PlayedByDesignerWidget implements AfterViewInit {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;
  @ViewChild('designer') designer!: TemplateRef<RowContext<Row>>;

  params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game by the designer",
      classname: "col-game-name",
      template: this.boardgame
    },
    { field: "rating", name: "Rating", tooltip: "Your rating for this game.", classname: "col-rating",
      valueHtml: (r: Row)=> (r.rating < 1) ? "" : r.rating.toString()
    },
    { field: "plays", name: "Plays", tooltip: "The number of times you have played this game.", classname: "col-number" },
    { field: "designer", name: "Designer", tooltip: "A designer of this game.", template: this.designer, classname: "col-designer" },
    { field: "designerTotalPlays", name: "Total Plays", tooltip: "Your total plays for this designer." },
    { field: "designerAverage", name: "Average Rating", tooltip: "Your average rating for this designer.",
      valueHtml: (r: Row)=> (r.designerAverage === 0) ? "" : r.designerAverage.toString()
    },
  ];
  columns: Column<Row>[] = [];

  private static DEFAULT_SELECTOR = "played(ME)";
  private selector = PlayedByDesignerWidget.DEFAULT_SELECTOR;
  loading: boolean = false;
  data: Row[] = [];

  constructor(private api: ExtstatsApi, public userService: UserConfigService, public tagService: UserTagService) {
    this.userService.checkDataIsLoaded().then();
  }

  async ngAfterViewInit(): Promise<void> {
    this.params[0].template = this.boardgame;
    this.params[3].template = this.designer;
    this.columns = this.params.map(c => new Column<Row>(c));
    await this.refresh();
  }

  async refresh(): Promise<void> {
    const geek = this.userService.getAGeek();
    if (geek) {
      this.loading = true;
      const rawData = await this.api.retrieve(this.buildQuery()) as RawData;
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
      const data: Row[] = [];
      for (const gg of rawData.geekgames.geekGames) {
        for (const rd of gg.game.designers) {
          const d = designerIndex[rd.bggid.toString()];
          data.push({ bggid: gg.game.bggid, name: gg.game.name, plays: gg.plays, rating: gg.rating,
            designer: { bggid: d.bggid, name: d.name }, designerTotalRatings: d.totalRatings, designerTotalPlays: d.totalPlays,
            designerGameCount: d.gameCount, designerAverage: (d.gameCount === 0) ? 0 : (Math.round(d.totalRatings * 100 / d.gameCount)/100) });
        }
      }
      this.loading = false;
      this.data = data;
    }
  }

  protected buildQuery(): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " geekGames { rating plays game { bggid name designers { bggid name } } } } }";
  }
}
