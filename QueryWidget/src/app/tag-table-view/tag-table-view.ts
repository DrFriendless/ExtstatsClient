import {Injectable} from "@angular/core";
import {View, ViewComponent} from "../view-mode";
import {TagTableViewComponent} from "./tag-table-view.component";
import {ExtstatsApi} from "extstats-api";
import {Row} from "../app.component";
import {TagTableControlsComponent} from "./tag-table-controls.component";
import {UserTagService} from "extstats-angular";

interface GeekGame {
  tags: string[];
  game: {
    name: string;
  };
  bggid: number;
}

export interface TagTableGame extends Row {
  tags: string[];
}

export interface GeekGamesTagResult {
  games: TagTableGame[];
}

interface QueryResult {
  geekgames: {
    geekGames: GeekGame[]
  }
}

@Injectable({ providedIn: 'root' })
export class TagTableView extends View {
  constructor(private api: ExtstatsApi, private tagService: UserTagService) {
    super({ key: "tags", description: "Tags" });
  }

  protected buildQuery(selector: string, geek: string | undefined): string {
    return `{geekgames(selector: "${selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " geekGames { bggid tags game { name }}}}";
  }

  async refreshGameData(selector: string, geek: string | undefined): Promise<GeekGamesTagResult> {
    const s = selector.replaceAll('"', '\\"');
    const query = this.buildQuery(s, geek);
    const qr = await this.api.retrieve(query) as QueryResult;
    return { games: qr.geekgames.geekGames.map(gg => { return { bggid: gg.bggid, name: gg.game.name, tags: gg.tags }; }) }
  }

  async refreshUserData() {
    this.tagService.refresh();
    const tagGroups = this.tagService.getTagGroups();
    return { tagGroups };
  }

  async refresh(selector: string, geek: string | undefined, view: ViewComponent, controls: ViewComponent): Promise<void> {
    view.setLoading(true);
    this.refreshGameData(selector, geek).then(data => {
      view.setLoading(false);
      view.setData(data);
    });
    const callback = (view as any).setTagGroup.bind(view);
    this.refreshUserData().then(data => {
      controls.setData({...data, callback });
      (view as any).setTagData(data);
    });
  }

  getComponent() {
    return TagTableViewComponent;
  }

  getControlsComponent(): any {
    return TagTableControlsComponent;
  }
}
