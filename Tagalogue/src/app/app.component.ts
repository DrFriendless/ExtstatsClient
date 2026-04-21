import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ExtstatsApi} from "extstats-api";
import {LoaderComponent, SelectorComboComponent, TagGroup, UserConfigService, UserTagService} from "extstats-angular";
import {TagChip} from "./tagchip/tagchip.component";
import {FormsModule} from "@angular/forms";

interface Game {
  bggid: number;
  name: string;
  tags?: string[];
}

interface QueryResult {
  games: Game[];
}

@Component({
  selector: 'tagalogue-widget',
  imports: [
    LoaderComponent,
    LoaderComponent,
    TagChip,
    SelectorComboComponent,
    FormsModule,
  ],
  templateUrl: './app.component.html'
})
export class TagalogueWidget implements AfterViewInit {
  @ViewChild(SelectorComboComponent) selectorCombo!: SelectorComboComponent;
  private static DEFAULT_SELECTOR = "tagged()";
  private selector = TagalogueWidget.DEFAULT_SELECTOR;
  newtag: string = "";
  newname: string = "";
  loading: boolean = false;
  tagsByGame: Record<string, string[]> = {};
  gameData: Record<string, Game> = {}
  rows: Game[] = [];
  tagGroups: TagGroup[] = [];
  currentGroup: TagGroup | undefined;
  usedTags: Set<string> = new Set();
  inTwoGroups: Set<string> = new Set();
  loggedIn = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService, private tagService: UserTagService) {
  }

  async ngAfterViewInit() {
    if (this.selectorCombo) {
      this.selectorCombo.setDefault(TagalogueWidget.DEFAULT_SELECTOR);
      this.selectorCombo.setSelected(TagalogueWidget.DEFAULT_SELECTOR);
    }
    this.loggedIn = !!this.userService.getLoggedInGeek();
    await this.refresh();
  }

  selectTagGroup(name: string) {
    const tgs = this.tagGroups.filter(g => g.name === name);
    if (tgs.length > 0) this.currentGroup = tgs[0];
  }

  async newTagGroup() {
    const name = this.newname.trim();
    if (!name) return;
    if (this.tagGroups.map(g => g.name).indexOf(name) >=  0) return;
    this.currentGroup = { name, tags: [] };
    this.tagGroups.push(this.currentGroup);
    await this.userService.setAndSave("tagalogue.taggroups", this.tagGroups);
    this.newname = "";
    this.recompute();
  }

  async newTag(groupName: string) {
    const t = this.newtag.trim();
    if (!t) return;
    if (!this.currentGroup) {
      return;
    }
    if (this.currentGroup.name !== groupName) {
      return;
    }
    if (this.currentGroup.tags.indexOf(t) >= 0) {
      return;
    }
    this.currentGroup.tags.push(t);
    await this.userService.setAndSave("tagalogue.taggroups", this.tagGroups);
    this.newtag = "";
    this.recompute();
  }

  async onSelectorChosen(event: string) {
    this.selector = event;
    await this.refresh();
  }

  public async refresh() {
    this.loading = true;
    const d = await this.api.retrieve(this.buildQuery()) as QueryResult;
    if (this.userService.isLoggedIn()) {
      await this.api.getPersonalData();
    }
    this.loading = false;
    for (const g of d.games) {
      this.gameData[g.bggid] = g;
    }
    const rs = [...d.games];
    rs.sort((g1, g2) => (g1.name < g2.name) ? -1 : (g1.name > g2.name) ? 1 : 0);
    this.rows = rs;
    if (this.userService.isLoggedIn()) await this.refreshUserData();
    if (!this.currentGroup && this.tagGroups) {
      this.currentGroup = this.tagGroups[0];
    }
  }

  async refreshUserData() {
    this.tagService.refresh();
    this.tagsByGame = await this.userService.get("tagalogue.tagsbygame", {}) || {};
    this.tagGroups = this.tagService.getTagGroups();
    this.recompute();
  }

  private recompute() {
    const used = new Set<string>();
    for (const tags of Object.values(this.tagsByGame)) {
      for (const t of tags) {
        used.add(t);
      }
    }
    this.usedTags = used;
    const inOneGroup: Set<string> = new Set();
    const inTwoGroup: Set<string> = new Set();
    for (const tags of this.tagGroups.map(g => g.tags)) {
      for (const t of tags) {
        if (inOneGroup.has(t)) inTwoGroup.add(t);
        inOneGroup.add(t);
      }
    }
    this.inTwoGroups = inTwoGroup;
    if (this.currentGroup && this.tagGroups.map(g => g.name).indexOf(this.currentGroup.name) < 0) {
      if (this.tagGroups.length === 0) {
        this.currentGroup = undefined;
      } else {
        this.currentGroup = this.tagGroups[0];
      }
    }
  }

  async onClick(tag: string, game: string, present: boolean) {
    if (present) {
      await this.userService.removeTagAndSave(game, tag);
    } else {
      await this.userService.addTagAndSave(game, tag);
    }
    this.recompute();
  }

  async killGroup(groupName: string) {
    const gs = this.tagGroups.filter(g => g.name === groupName);
    if (gs.length === 0) return;
    if (gs[0].tags.length > 0) return;
    this.tagGroups = this.tagGroups.filter(g => g.name !== groupName);
    await this.userService.setAndSave("tagalogue.taggroups", this.tagGroups);
    this.recompute();
  }

  async onTagGroupTagRemove(groupName: string, tag: string) {
    const g = this.tagGroups.filter(g => g.name === groupName)[0];
    g.tags = g.tags.filter(t => t !== tag);
    await this.userService.setAndSave("tagalogue.taggroups", this.tagGroups);
    this.recompute();
  }

  protected buildQuery(): string {
    return `{games(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getLoggedInGeek()}"}]) { name bggid } }`;
  }

  protected readonly Object = Object;
}
