import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { flatMap, map, tap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from './security.service';
import { UserConfig, BuddySet } from 'extstats-core';

@Component({
  selector: 'extstats-user-config',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class UserConfigComponent implements OnDestroy {
  private usernames = new Subject<string>();
  private readonly usernameSubscription: Subscription;
  public username: string;
  public buddyGroups: BuddySet[] = [];
  public personalData = '';
  public geekids: string[] = [];

  constructor(private http: HttpClient, private securityApi: SecurityService) {
    this.usernameSubscription = this.usernames.asObservable()
      .pipe(
        tap(u => console.log("in pipe u is " + u)),
        map(u => u ? u : undefined),
        filter(u => !!u),
        tap(u => this.username = u),
        flatMap(u => this.securityApi.loadUserData()),
        tap(pd => {
          console.log("pd");
          console.log(pd);
        }),
        filter(pd => !!(pd && pd.userData && pd.userData.config)),
        tap(pd => this.setToUi(pd.userData.config)),
        map(pd => pd ? JSON.stringify(pd) : '')
      )
      .subscribe(pds => this.personalData = pds);
    this.refresh();
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

  public refresh() {
    this.usernames.next(this.securityApi.getStoredUsername());
  }

  buddiesChanged(event: BuddySet) {
    if (event.getName() === "") this.buddyGroups = this.buddyGroups.filter(bg => bg !== event);
    console.log(this.buddyGroups);
  }

  public ngOnDestroy() {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }
}
