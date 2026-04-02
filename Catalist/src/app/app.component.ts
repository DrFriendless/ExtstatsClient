import {AfterViewInit, Component, signal, ViewChild, WritableSignal} from '@angular/core';
import {ExtstatsApi} from "extstats-api";
import {LoaderComponent, UserConfigService, UserTagService} from "extstats-angular";
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
  loading: boolean = false;
  loggedIn = false;
  showDeployment = false;
  storeData: WritableSignal<string[]> = signal([]);
  @ViewChild('chooser') chooser!: SelectorTypeChooserComponent;
  @ViewChild('store') store!: CatalistStoreComponent;
  @ViewChild('composer') composer!: CatalistComposerComponent;
  @ViewChild('results') results!: RunResultsComponent;

  constructor(private api: ExtstatsApi, private userService: UserConfigService, private tagService: UserTagService) {
  }

  async ngAfterViewInit() {
    this.loggedIn = !!this.userService.getLoggedInGeek();
    await this.refresh();
  }

  chooseType(typ: SelectorType) {
    this.composer.setType(typ);
  }

  chooseSelector(selector: string) {
    const typ = parseSelector(selector);
    console.log("chooseSelector");
    console.log(JSON.stringify(typ));
    if (typ) this.composer.setType(typ);
  }

  private async refresh() {
    this.storeData.set(await this.userService.get("catalist.store", []) || []);
  }

  async save(selector: string) {
    this.storeData.update(val => [...val, selector]);
    await this.userService.setAndSave("catalist.store", this.storeData());
  }

  async run(selector: string) {
    const query = `{games(selector: "${selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) { bggid name } }`;
    this.loading = true;
    const data = await this.api.retrieve(query) as RetrieveResult;
    console.log(JSON.stringify(data));
    data.games.sort((g1, g2) => g1.name < g2.name ? -1 : g2.name < g1.name ? 1 : 0);
    this.loading = false;
    this.results.setData(data.games);
  }
}
