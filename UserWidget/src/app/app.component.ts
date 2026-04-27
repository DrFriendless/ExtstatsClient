import {Component, HostListener, OnDestroy, OnInit} from "@angular/core"
import { Subscription } from 'rxjs/internal/Subscription';
import {BuddySet} from 'extstats-core';
import {GeekChipsComponent, GeekComboComponent, LoaderComponent, UserConfigService} from "extstats-angular";
import {BuddySetComponent} from "./buddy-set/buddy-set.component";
import {ExtstatsApi} from "extstats-api";

@Component({
  selector: 'extstats-user-config',
  templateUrl: './app.component.html',
  imports: [
    GeekComboComponent,
    BuddySetComponent,
    GeekChipsComponent,
    LoaderComponent
  ]
})
export class UserConfigComponent implements OnDestroy, OnInit {
  private readonly usernameSubscription: Subscription | undefined;
  personalData: string = "";
  public username: string | undefined;
  public buddyGroups: BuddySet[] = [];
  public geekids: string[] = [];
  loading = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  public async ngOnInit(): Promise<void> {
    await this.reload();
  }

  private async reload() {
    if (this.userService.isLoggedIn()) {
      this.loading = true;
      const p1 = this.api.getPersonalData();
      this.personalData = JSON.stringify(await p1);
      this.username = await this.userService.get("user.username", undefined);
      this.geekids = await this.userService.get<string[]>("user.usernames", []) || [];
      this.buddyGroups = await this.userService.get<BuddySet[]>("user.buddies", []) || [];
      if ((!this.geekids || this.geekids.length === 0) && this.username) {
        this.geekids = [ this.username ];
        await this.userService.setAndSave("user.usernames", this.geekids);
      }
      this.loading = false;
    } else {
      this.personalData = "";
      this.username = undefined;
      this.buddyGroups = [];
      this.geekids = [];
      this.loading = false;
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
    await this.userService.save();
    await this.reload();
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

  @HostListener('window:message', ['$event'])
  async onMessage(event: any) {
    console.log("onMessage");
    await this.reload();
  }
}
