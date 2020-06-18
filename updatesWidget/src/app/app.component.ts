import { Component, OnInit } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, Subject } from "rxjs"
import { ToProcessElement } from "extstats-core"
import { UserDataService } from "extstats-angular"
import { switchMap } from "rxjs/operators"
const dateFormat = require("dateformat");

@Component({
  selector: 'extstats-updates',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private data$: Observable<ToProcessElement[]>;
  private subject = new Subject<any>();
  other: ToProcessElement[] = [];
  plays: ToProcessElement[] = [];
  geek: string = undefined;

  constructor(private http: HttpClient, private userService: UserDataService) {
  }

  ngOnInit(): void {
    this.geek = this.userService.getAGeek();
    this.data$ = this.subject
      .asObservable()
      .pipe(
        switchMap(() => this.doQuery(this.geek))
      ) as Observable<ToProcessElement[]>;
    this.data$.subscribe(vs => this.processData(vs));
    this.subject.next(undefined);
  }

  private processData(data: ToProcessElement[]) {
    this.other = [];
    this.plays = [];
    for (const tpe of data) {
      tpe.lastUpdate = transform(tpe.lastUpdate);
      tpe.nextUpdate = transform(tpe.nextUpdate);
      if (tpe.processMethod === 'processPlays') {
        this.plays.push(tpe);
      } else {
        this.other.push(tpe);
      }
    }
    this.plays.sort(byDateDescending);
  }

  private patch(tpe: ToProcessElement): void {
    for (const o of this.other) {
      if (o.url === tpe.url) {
        o.lastUpdate = transform(tpe.lastUpdate);
        o.nextUpdate = transform(tpe.nextUpdate);
        return;
      }
    }
    for (const o of this.plays) {
      if (o.url === tpe.url) {
        o.lastUpdate = transform(tpe.lastUpdate);
        o.nextUpdate = transform(tpe.nextUpdate);
        return;
      }
    }
  }

  private noLastUpdate(url: string): void {
    for (const o of this.other) {
      if (o.url === url) {
        o.lastUpdate = "";
        return;
      }
    }
    for (const o of this.plays) {
      if (o.url === url) {
        o.lastUpdate = "";
        return;
      }
    }
  }


  onRefreshAll(): void {
    this.subject.next(undefined);
  }

  onRefresh(url: string): void {
    this.doRefresh(url).subscribe(tpe => this.patch(tpe));
  }

  onRefreshOld(): void {
    this.doRefreshOld(this.geek).subscribe(urls => urls.forEach(url => this.noLastUpdate(url)));
  }

  private doRefreshOld(geek: string): Observable<string[]> {
    const options = {
      headers: new HttpHeaders().set("x-api-key", getApiKey())
    };
    return this.http.post("https://api.drfriendless.com/v1/updateOld/?geek=" + encodeURIComponent(geek), {}, options) as Observable<string[]>;
  }

  private doRefresh(url: string): Observable<ToProcessElement> {
    const options = {
      headers: new HttpHeaders().set("x-api-key", getApiKey())
    };
    const body = { url };
    return this.http.post("https://api.drfriendless.com/v1/update", body, options) as Observable<ToProcessElement>;
  }

  private doQuery(geek: string): Observable<ToProcessElement[]> {
    const options = {
      headers: new HttpHeaders().set("x-api-key", getApiKey())
    };
    return this.http.get("https://api.drfriendless.com/v1/updates/?geek=" + encodeURIComponent(geek), options) as Observable<ToProcessElement[]>;
  }
}

function byDateDescending(t1: ToProcessElement, t2: ToProcessElement): number {
  let c = t1.year - t2.year;
  if (c === 0) c = t1.month - t2.month;
  return -c;
}

function getApiKey(): string {
  return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
}

function transform(s: string) {
  if (!s) return "";
  return dateFormat(new Date(s), "h:MM:sstt d mmm yy");
}
