import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead, RowContext,
} from "extstats-datatable";
import {ExtstatsApi, ProcessedRecRow} from "extstats-api";
import {BoardGameLinkComponent, LoaderComponent, UserConfigService, UserTagService} from "extstats-angular";

@Component({
  selector: 'extstats-recommendations',
  imports: [
    DataTableController,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableBody,
    DataTableHead,
    LoaderComponent,
    BoardGameLinkComponent
  ],
  templateUrl: './recommendations.component.html'
})
export class RecommendationsComponent implements AfterViewInit {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<ProcessedRecRow>>;
  private params: ColumnParams<ProcessedRecRow>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The recommended game",
      template: this.boardgame,
      classname: "col-game-name"
    },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek", classname: "col-rating",
      valueHtml: (r: ProcessedRecRow) => (!r.bggRating) ? "" : ((Math.floor(r.bggRating * 10))/10).toString()
    },
    { field: "bggRanking", name: "BGG Ranking", tooltip: "Ranking of this game on BoardGameGeek", classname: "col-ranking",
      valueHtml: (r: ProcessedRecRow) => (!r.bggRanking) ? "" : r.bggRanking.toString()
    },
    { field: "score", name: "X-Factor Score", tooltip: "Match as assessed by the recommendation algorithm", classname: "col-number",
      valueHtml: (r: ProcessedRecRow) => (!r.score) ? "" : ((Math.floor(r.score * 100))/100).toString()
    },
    { field: "score2", name: "Score 2", tooltip: "Match as assessed by the recommendation algorithm with only 0.2 of the game's bias",
      classname: "col-number",
      valueHtml: (r: ProcessedRecRow) => (!r.score2) ? "" : ((Math.floor(r.score2 * 100))/100).toString()
    },
    { field: "score0", name: "Score 0", tooltip: "Match as assessed by the recommendation algorithm with 0 game bias",
      classname: "col-number",
      valueHtml: (r: ProcessedRecRow) => (!r.score0) ? "" : ((Math.floor(r.score0 * 100))/100).toString()
    }
  ];
  columns: Column<ProcessedRecRow>[] = [];
  rows: ProcessedRecRow[] = [];
  geek: string | undefined;
  loading = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService, public tagService: UserTagService) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<ProcessedRecRow>(c));
  }

  protected processData(raw: ProcessedRecRow[]): void {
    this.rows = raw;
  }

  private async refresh() {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.loading = true;
      this.processData(await this.api.getRecommendations(this.geek));
      this.loading = false;
    }
  }
}
