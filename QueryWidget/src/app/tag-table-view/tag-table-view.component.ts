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
  UserConfigService,
  UserTagService
} from "extstats-angular";
import {ViewComponent} from "../view-mode";
import {GeekGamesTagResult, GeekGameTagResult} from "./tag-table-view";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";

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
  data = signal<GeekGameTagResult[]>([]);
  private columnParams: ColumnParams<GeekGamesTagResult>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you want in trade",
      template: this.boardgame as unknown as TemplateRef<RowContext<GeekGamesTagResult>>,
      classname: "col-game-name"
    },
    {
      field: "tags", name: "Tags", tooltip: "Whether you have given this game these tags",
      template: this.tagstemplate as unknown as TemplateRef<RowContext<GeekGamesTagResult>>,
      classname: "col-tags"
    }
  ];
  tagsByGame: Record<string, string[]> = {};
  tagGroups: TagGroup[] = [];
  columns: WritableSignal<Column<any>[]> = signal([]);

  constructor(public tagService: UserTagService, private userService: UserConfigService) {
  }

  public ngAfterViewInit() {
    this.columnParams[0].template = this.boardgame()! as TemplateRef<RowContext<GeekGamesTagResult>>;
    this.columnParams[1].template = this.tagstemplate()! as TemplateRef<RowContext<GeekGamesTagResult>>;
    this.columns.set(this.columnParams.map(c => new Column<GeekGamesTagResult>(c)));
  }

  async onClick(tag: string, game: string, present: boolean) {
    if (present) {
      await this.userService.removeTagAndSave(game, tag);
    } else {
      await this.userService.addTagAndSave(game, tag);
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

  setTagData(data: { tagsByGame: Record<string, string[]>, tagGroups: TagGroup[] }) {
    this.tagsByGame = data.tagsByGame;
    this.tagGroups = data.tagGroups;
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }
}
