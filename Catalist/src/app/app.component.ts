import {AfterViewInit, Component, signal, viewChild, WritableSignal} from '@angular/core';
import {CatalistMetadata, ExtstatsApi} from "extstats-api";
import {LoaderComponent, UserConfigService} from "extstats-angular";
import {FormsModule} from "@angular/forms";
import {SelectorTypeChooserComponent} from "./selector-chooser/selector-type-chooser.component";
import {CatalistStoreComponent} from "./catalist-store/catalist-store-component";
import {CatalistComposerComponent} from "./composer/composer.component";
import {SelectorType} from "./selector-types.mjs";
import {RunResultsComponent} from "./run-results/run-results.component";
import {parseSelector} from "./selector-parser";

interface RetrieveResult {
  games: {
    bggid: number;
    name: string;
  }[];
}

@Component({
  selector: 'catalist-widget',
  imports: [
    LoaderComponent,
    FormsModule,
    SelectorTypeChooserComponent,
    CatalistStoreComponent,
    CatalistComposerComponent,
    RunResultsComponent,
  ],
  templateUrl: './app.component.html'
})
export class CatalistWidget implements AfterViewInit {
  loading = signal<boolean>(false);
  loggedIn = false;
  showDeployment = false;
  metadata: WritableSignal<CatalistMetadata> = signal({ tags: [], mechanics: [], categories: [] });
  storeData: WritableSignal<string[]> = signal([]);
  composer = viewChild<CatalistComposerComponent>('composer');
  results = viewChild<RunResultsComponent>('results');

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  async ngAfterViewInit() {
    this.loggedIn = !!this.userService.getLoggedInGeek();
    await this.refresh();
  }

  chooseType(typ: SelectorType) {
    this.composer()!.setType(typ);
  }

  chooseSelector(selector: string) {
    const typ = parseSelector(selector);
    if (typ) this.composer()!.setType(typ);
  }

  async removeSelector(selector: string) {
    const sd = this.storeData().filter(s => s !== selector);
    await this.userService.setAndSave("catalist.store", sd);
    this.storeData.set(sd);
  }

  private async refresh() {
    const sdp = this.userService.get("catalist.store", []);
    const mdp = this.api.getCatalistMetadata();
    this.storeData.set(await sdp || []);
    this.metadata.set(await mdp);
  }

  async save(selector: string) {
    this.storeData.update(val => [...val, selector]);
    await this.userService.setAndSave("catalist.store", this.storeData());
  }

  async run(selector: string) {
    const s = selector.replaceAll('"', '\\"');
    const query = `{games(selector: "${s}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) { bggid name } }`;
    this.loading.set(true);
    const data = await this.api.retrieve(query) as RetrieveResult;
    if (data && data.games) {
      data.games.sort((g1, g2) => g1.name < g2.name ? -1 : g2.name < g1.name ? 1 : 0);
    }
    this.loading.set(false);
    this.results()!.setData(data.games);
  }
}
