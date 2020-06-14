import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn: Subject<boolean> = new Subject();
  private isLoggedIn$ = this.loggedIn.asObservable();
  private registeredFeatures: Set<string> = new Set<string>();

  constructor(private http: HttpClient) {
    this.checkForLoggedIn();
  }

  checkForLoggedIn() {
    this.http.get("https://api.drfriendless.com/v1/login", {withCredentials: true}).subscribe(result => {
      console.log(result);
      this.loggedIn.next(!!result);
    }, err => {
      console.log("You cannot login from this location.");
      this.loggedIn.next(false);
    });
  }

  registerFeature(id: string): void {
    this.registeredFeatures.add(id);
  }

  get features(): Set<string> {
    return this.registeredFeatures;
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }
}
