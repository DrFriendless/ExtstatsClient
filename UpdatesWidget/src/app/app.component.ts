import { Component, OnInit } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, Subject } from "rxjs"
import { ToProcessElement } from "extstats-core"
import { UserDataService } from "extstats-angular"
import { switchMap } from "rxjs/operators"
import dateFormat from "dateformat";

@Component({
  selector: 'extstats-updates',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private data$: Observable<ToProcessElement[]> | undefined;
  private subject = new Subject<any>();
  other: ToProcessElement[] = [];
  plays: ToProcessElement[] = [];
  geek: string | undefined = undefined;

  constructor(private http: HttpClient, private userService: UserDataService) {
  }

  ngOnInit(): void {
    this.geek = this.userService.getAGeek();
    this.data$ = this.subject
      .asObservable()
      .pipe(
        switchMap(() => this.doQuery(this.geek!))
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
      if (tpe.processMethod === 'processYear') {
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
    this.doRefreshOld(this.geek!).subscribe(urls => urls.forEach(url => this.noLastUpdate(url)));
  }

  private doRefreshOld(geek: string): Observable<string[]> {
    return this.http.post("/api/updateOld?geek=" + encodeURIComponent(geek), {}) as Observable<string[]>;
  }

  private doRefresh(url: string): Observable<ToProcessElement> {
    const body = { url };
    return this.http.post("/api/update", body) as Observable<ToProcessElement>;
  }

  private doQuery(geek: string): Observable<ToProcessElement[]> {
    return this.http.get("/api/updates?geek=" + encodeURIComponent(geek)) as Observable<ToProcessElement[]>;
  }
}

function byDateDescending(t1: ToProcessElement, t2: ToProcessElement): number {
  let c = t1.year - t2.year;
  if (c === 0) c = t1.month - t2.month;
  return -c;
}

function transform(s: string) {
  if (!s) return "";
  return dateFormat(new Date(s), "h:MM:sstt d mmm yy");
}
