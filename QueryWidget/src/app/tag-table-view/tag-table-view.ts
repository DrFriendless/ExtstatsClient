import {Injectable} from "@angular/core";
import {View, ViewComponent} from "../view-mode";
import {TagTableViewComponent} from "./tag-table-view.component";
import {ExtstatsApi} from "extstats-api";
import {Row} from "../app.component";
import {TagTableControlsComponent} from "./tag-table-controls.component";
import {UserConfigService, UserTagService} from "extstats-angular";

export interface GeekGamesTagResult {
  games: GeekGameTagResult[];
}

export interface GeekGameTagResult extends Row {
}

@Injectable({ providedIn: 'root' })
export class TagTableView extends View {
  constructor(private api: ExtstatsApi, private tagService: UserTagService, private userService: UserConfigService) {
    super({ key: "tags", description: "Tags" });
  }

  protected buildQuery(selector: string, geek: string | undefined): string {
    return `{games(selector: "${selector}", vars: [{name: "ME", value: "${geek}"}]) { name bggid } }`;
  }

  async refreshGameData(selector: string, geek: string | undefined) {
    const s = selector.replaceAll('"', '\\"');
    const query = this.buildQuery(s, geek);
    return await this.api.retrieve(query);
  }

  async refreshUserData() {
    this.tagService.refresh();
    const tagsByGame = await this.userService.get("tagalogue.tagsbygame", {}) || {};
    const tagGroups = this.tagService.getTagGroups();
    return { tagsByGame, tagGroups };
  }

  async refresh(selector: string, geek: string | undefined, view: ViewComponent, controls: ViewComponent): Promise<void> {
    view.setLoading(true);
    this.refreshGameData(selector, geek).then(data => {
      view.setLoading(false);
      view.setData(data as GeekGamesTagResult);
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
