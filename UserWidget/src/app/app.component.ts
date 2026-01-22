import {Component, HostListener, OnDestroy, OnInit} from "@angular/core"
import { Subscription } from 'rxjs/internal/Subscription';
import {BuddySet, DisambiguationData} from 'extstats-core';
import {GeekChipsComponent, GeekComboComponent, LoaderComponent, UserConfigService} from "extstats-angular";
import {BuddySetComponent} from "./buddy-set/buddy-set.component";
import {ExtstatsApi} from "extstats-api";
import {NgClass} from "@angular/common";

@Component({
  selector: 'extstats-user-config',
  templateUrl: './app.component.html',
  imports: [
    GeekComboComponent,
    BuddySetComponent,
    GeekChipsComponent,
    LoaderComponent,
    NgClass
  ]
})
export class UserConfigComponent implements OnDestroy, OnInit {
  private readonly usernameSubscription: Subscription | undefined;
  personalData: string = "";
  public username: string | undefined;
  public buddyGroups: BuddySet[] = [];
  public geekids: string[] = [];
  disambiguationData: DisambiguationData | undefined;
  disambiguationUserConfig: Record<number, number> = {}
  loading = false;
  loading2 = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
    console.log("constructor");
  }

  public async ngOnInit(): Promise<void> {
    console.log("ngOnInit");
    await this.reload();
  }

  private async reload() {
    if (this.userService.isLoggedIn()) {
      console.log("logged in");
      this.loading = true;
      this.loading2 = true;
      const p1 = this.api.getPersonalData();
      const p2 = this.api.getDisambiguationData(this.userService.getAGeek()!);
      this.personalData = JSON.stringify(await p1);
      this.disambiguationUserConfig = await this.userService.get("disambiguation.defaults", {}) || {};
      this.username = await this.userService.get("user.username", undefined);
      this.geekids = await this.userService.get<string[]>("user.usernames", []) || [];
      this.buddyGroups = await this.userService.get<BuddySet[]>("user.buddies", []) || [];
      if ((!this.geekids || this.geekids.length === 0) && this.username) {
        this.geekids = [ this.username ];
        await this.userService.setAndSave("user.usernames", this.geekids);
      }
      this.loading = false;
      this.disambiguationData = await p2;
      this.loading2 = false;
    } else {
      console.log("not logged in");
      this.personalData = "";
      this.username = undefined;
      this.buddyGroups = [];
      this.geekids = [];
      this.disambiguationData = undefined;
      this.loading = false;
      this.loading2 = false;
    }
  }

  public async save() {
    if (!this.geekids && this.username) this.geekids = [ this.username ];
    await this.userService.set("user.usernames", this.geekids);
    const bs = this.buddyGroups
      .filter(bg => bg.getName() && bg.getBuddies().length > 0)
      .map(bg => { return { name: bg.getName(), buddies: bg.getBuddies() }; });
    await this.userService.set("user.buddies", bs);
    this.loading = true;
    this.loading2 = true;
    await this.userService.save();
    await this.reload();
  }

  public async saveDisambiguation() {
    await this.userService.set("disambiguation.defaults", this.disambiguationUserConfig || {});
    this.disambiguationData = undefined;
    await this.save();
  }

  public more() {
    this.buddyGroups.push(new BuddySet('', []));
  }

  public buddiesChanged(event: BuddySet) {
    if (event.getName() === "") this.buddyGroups = this.buddyGroups.filter(bg => bg !== event);
    console.log("buddiesChanged");
    console.log(this.buddyGroups);
  }

  public ngOnDestroy() {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
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

  public assigned(expansionId: number, basegameId: number): boolean {
    return this.disambiguationUserConfig[expansionId] === basegameId;
  }

  public unassigned(expansionId: number): boolean {
    return this.disambiguationUserConfig[expansionId] === undefined;
  }

  @HostListener('window:message', ['$event'])
  async onMessage(event: any) {
    console.log("onMessage");
    await this.reload();
  }
}
