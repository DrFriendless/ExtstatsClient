import {Component, HostListener, OnDestroy, OnInit} from "@angular/core"
import { Subscription } from 'rxjs/internal/Subscription';
import { BuddySet } from 'extstats-core';
import {GeekChipsComponent, GeekComboComponent, LoaderComponent, UserDataService} from "extstats-angular";
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

  constructor(private api: ExtstatsApi, private userService: UserDataService) {
  }

  public async ngOnInit(): Promise<void> {
    await this.reload();
  }

  private async reload() {
    this.loading = true;
    const pd = await this.api.getPersonalData();
    console.log(pd);
    this.personalData = JSON.stringify(pd);
    this.username = await this.userService.get("user.username", undefined);
    this.geekids = await this.userService.get<string[]>("user.usernames", []);
    this.buddyGroups = await this.userService.get<BuddySet[]>("user.buddies", []);
    console.log(this.geekids, this.username);
    if ((!this.geekids || this.geekids.length === 0) && this.username) {
      this.geekids = [ this.username ];
      await this.userService.setAndSave("user.usernames", this.geekids);
    }
    this.loading = false;
    console.log(this.geekids);
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
    console.log(this.buddyGroups);
  }

  public ngOnDestroy() {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  @HostListener('window:message', ['$event'])
  async onMessage(event: any) {
    await this.reload();
  }
}
