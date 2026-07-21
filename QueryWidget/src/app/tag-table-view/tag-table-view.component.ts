import {
  AfterViewInit,
  Component,
  Signal,
  signal,
  TemplateRef,
  viewChild, WritableSignal,
} from "@angular/core";
import {
  BoardGameLinkComponent,
  LoaderComponent,
  TagChip,
  TagGroup,
  UserTagService
} from "extstats-angular";
import {ViewComponent} from "../view-mode";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";
import {GeekGamesTagResult, TagTableGame} from "./tag-table-view";

@Component({
  selector: 'tag-view',
  templateUrl: './tag-table-view.component.html',
  imports: [
    LoaderComponent,
    BoardGameLinkComponent,
    TagChip,
    DataTable,
    DataTableBody,
    DataTableController,
    DataTableHead,
  ]
})
export class TagTableViewComponent implements AfterViewInit, ViewComponent {
  loading = signal<boolean>(false);
  boardgame: Signal<TemplateRef<any> | undefined> = viewChild('boardgame');
  tagstemplate: Signal<TemplateRef<any> | undefined> = viewChild('tagstemplate');
  currentGroup = signal<TagGroup | undefined>(undefined);
  data = signal<TagTableGame[]>([]);
  private columnParams: ColumnParams<TagTableGame>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you want in trade",
      template: this.boardgame as unknown as TemplateRef<RowContext<TagTableGame>>,
      classname: "col-game-name"
    },
    {
      field: "tags", name: "Tags", tooltip: "Whether you have given this game these tags",
      template: this.tagstemplate as unknown as TemplateRef<RowContext<TagTableGame>>,
      classname: "col-tags"
    }
  ];
  tagGroups: TagGroup[] = [];
  columns: WritableSignal<Column<any>[]> = signal([]);

  constructor(public tagService: UserTagService) {
  }

  public ngAfterViewInit() {
    this.columnParams[0].template = this.boardgame()! as TemplateRef<RowContext<TagTableGame>>;
    this.columnParams[1].template = this.tagstemplate()! as TemplateRef<RowContext<TagTableGame>>;
    this.columns.set(this.columnParams.map(c => new Column<TagTableGame>(c)));
  }

  async onToggle(tag: string, game: TagTableGame, present: boolean) {
    if (present) {
      game.tags = await this.tagService.removeTagAndSave(game.bggid, tag);
    } else {
      game.tags = await this.tagService.addTagAndSave(game.bggid, tag);
    }
  }

  setData(data: GeekGamesTagResult): void {
    data.games.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    this.data.set(data.games);
  }

  setTagGroup(tagGroup: TagGroup) {
    if (tagGroup) {
      this.currentGroup.set(tagGroup);
    }
  }

  setTagData(data: { tagGroups: TagGroup[] }) {
    this.tagGroups = data.tagGroups;
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }
}
