import {Component, HostListener, model, OnInit, signal} from "@angular/core"
import {LoaderComponent, SwitchComponent, UserConfigService} from "extstats-angular";
import {DisambiguationData, ExtstatsApi} from "extstats-api";
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'extstats-preferences',
  templateUrl: './app.component.html',
  imports: [
    LoaderComponent,
    NgClass,
    SwitchComponent,
    FormsModule
  ]
})
export class AppComponent implements OnInit {
  disambiguationData: DisambiguationData | undefined;
  disambiguationUserConfig: Record<number, number> = {}
  disambiguate = model(true);
  loggedIn = signal(false);
  loading = signal(false);

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  public async ngOnInit(): Promise<void> {
    await this.reload();
  }

  private async reload() {
    this.loggedIn.set(this.userService.isLoggedIn());
    if (this.loggedIn()) {
      this.loading.set(true);
      await this.api.getPersonalData();
      this.disambiguationData = await this.api.getDisambiguationData();
      this.disambiguationUserConfig = await this.userService.get("disambiguation.defaults", {}) || {};
      let dis = await this.userService.get("disambiguation.enable", true);
      if (dis === undefined) dis = true;
      this.disambiguate.set(dis);
      console.log(`dis ${dis} ${this.disambiguate()}`);
      this.loading.set(false);
    } else {
      console.log("not logged in");
      this.disambiguationData = undefined;
      this.loading.set(false);
    }
  }

  public async save() {
    console.log(`saving ${this.disambiguate()}`);
    this.loading.set(true);
    await this.userService.set("disambiguation.defaults", this.disambiguationUserConfig || {});
    await this.userService.set("disambiguation.enable", this.disambiguate());
    this.disambiguationData = undefined;
    await this.userService.save();
    await this.reload();
  }

  public assignedBaseGame(expansionId: number): number | undefined {
    return this.disambiguationUserConfig[expansionId];
  }

  public assign(expansionId: number, basegameId: number) {
    this.disambiguationUserConfig[expansionId] = basegameId;
  }

  public unassign(expansionId: number) {
    delete this.disambiguationUserConfig[expansionId];
  }

  @HostListener('window:message', ['$event'])
  async onMessage(event: any) {
    console.log("onMessage");
    await this.reload();
  }
}
