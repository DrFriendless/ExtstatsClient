import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PersonalData, UserConfig, BuddySet } from 'extstats-core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class SecurityService implements SecurityApi {

  constructor(private http: HttpClient) { }

  public loadUserData(): Observable<PersonalData | undefined> {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)
      };
      console.log('loading personal data for ' + jwt);
      return this.http.get('https://api.drfriendless.com/v1/personal', options) as Observable<PersonalData>;
    } else {
      return of(undefined);
    }
  }

  public getStoredUsername(): string | undefined {
    return localStorage.getItem('username');
  }

  public saveUserConfig(userConfig: UserConfig): Observable<any> {
    const jwt = localStorage.getItem('jwt');
    console.log(jwt);
    if (jwt) {
      const options = {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)
      };
      console.log(options);
      const body = userConfig;
      console.log(body);
      return this.http.post<any>('https://api.drfriendless.com/v1/update', body, options);
    } else {
      return of(undefined);
    }
  }
}

export interface SecurityApi {
  loadUserData(): Observable<PersonalData | undefined>;

  getStoredUsername(): string | undefined;

  saveUserConfig(userConfig: UserConfig): Observable<any>;
}

export class TestSecurityService implements SecurityApi {
  private GEEK = 'Friendless';
  private userConfig = { usernames: [this.GEEK], buddies: [ new BuddySet("Family", ["Friendless", "Scrabblette", "harley22"]) ] } as UserConfig;

  public getStoredUsername(): string | undefined {
    return this.GEEK;
  }

  public loadUserData(): Observable<PersonalData | undefined> {
    return of({ error: 'TokenExpiredError', userData: { config: this.userConfig }, allData: undefined } as PersonalData);
  }

  public saveUserConfig(userConfig: UserConfig) {
    this.userConfig = userConfig;
    console.log(userConfig);
    return of(undefined);
  }
}
