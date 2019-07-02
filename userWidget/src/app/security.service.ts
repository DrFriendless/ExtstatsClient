import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PersonalData, UserConfig, BuddySet } from 'extstats-core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class SecurityService implements SecurityApi {

  constructor(private http: HttpClient) { }

  public loadUserData(): Observable<PersonalData> {
    const options = { withCredentials: true };
    return this.http.get('https://api.drfriendless.com/v1/personal', options) as Observable<PersonalData>;
  }

  public saveUserConfig(userConfig: UserConfig): Observable<any> {
      const options = {
        withCredentials: true
      };
      return this.http.post<any>('https://api.drfriendless.com/v1/updatePersonal', userConfig, options);
  }
}

export interface SecurityApi {
  loadUserData(): Observable<PersonalData | undefined>;

  saveUserConfig(userConfig: UserConfig): Observable<any>;
}

export class TestSecurityService implements SecurityApi {
  private GEEK = 'Friendless';
  private USERNAME = 'friendless';
  private userConfig = { usernames: [this.GEEK], buddies: [ new BuddySet("Family", ["Friendless", "Scrabblette", "harley22"]) ] } as UserConfig;

  public loadUserData(): Observable<PersonalData | undefined> {
    return of({
      error: 'TokenExpiredError',
      userData: { config: this.userConfig, jwt: { nickname: this.USERNAME } },
      allData: undefined
    } as PersonalData);
  }

  public saveUserConfig(userConfig: UserConfig) {
    this.userConfig = userConfig;
    console.log(userConfig);
    return of(undefined);
  }
}
