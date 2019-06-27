import { Component, OnDestroy, OnInit } from "@angular/core"
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient } from '@angular/common/http';
import { SecurityService, TestSecurityService } from "./security.service"
import { UserConfig, BuddySet } from 'extstats-core';

@Component({
  selector: 'extstats-user-config',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class UserConfigComponent implements OnDestroy, OnInit {
  private readonly usernameSubscription: Subscription;
  public username: string;
  public buddyGroups: BuddySet[] = [];
  public personalData = '';
  public geekids: string[] = [];

  constructor(private http: HttpClient, private securityApi: TestSecurityService) {
  }

  public ngOnInit(): void {
    this.securityApi.loadUserData().subscribe(pd => {
      console.log(pd);
      this.username = pd.userData.jwt.nickname;
      this.personalData = pd ? JSON.stringify(pd) : '';
      this.setToUi(pd.userData.config);
    });
  }

  private setToUi(userConfig: UserConfig) {
    console.log(userConfig);
    this.geekids = userConfig.usernames;
    this.buddyGroups = userConfig.buddies;
  }

  private gatherUserData(): UserConfig {
    return { usernames: this.geekids, buddies: this.buddyGroups } as UserConfig;
  }

  public save() {
    console.log(this.gatherUserData());
    this.securityApi.saveUserConfig(this.gatherUserData()).subscribe(
      result => console.log("saved"),
      err => console.log(err),
      () => console.log("complete"));
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
}
