import { Component, OnInit } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, Subject } from "rxjs"
import { ToProcessElement } from "extstats-core"
import { UserDataService } from "extstats-angular"
import { switchMap } from "rxjs/operators"

@Component({
  selector: 'extstats-updates',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private data$: Observable<ToProcessElement[]>;
  public other: ToProcessElement[] = [];
  public plays: ToProcessElement[] = [];
  private subject = new Subject<any>();

  constructor(private http: HttpClient, private userService: UserDataService) {
  }

  public ngOnInit(): void {
    const geek = this.userService.getAGeek();
    console.log(geek);
    this.data$ = this.subject
      .asObservable()
      .pipe(
        switchMap(junk => this.doQuery(geek))
      ) as Observable<ToProcessElement[]>;
    this.data$.subscribe(vs => this.processData(vs));
    this.subject.next(undefined);
  }

  private processData(data: ToProcessElement[]) {
    this.other = [];
    this.plays = [];
    for (const tpe of data) {
      const s = JSON.stringify(tpe);
      tpe['string'] = s;
      if (tpe.processMethod === 'processPlays') {
        this.plays.push(tpe);
      } else {
        this.other.push(tpe);
      }
    }
    this.plays.sort(this.byDateDescending);
  }

  private byDateDescending(t1: ToProcessElement, t2: ToProcessElement): number {
    let c = t1.year - t2.year;
    if (c === 0) c = t1.month - t2.month;
    return -c;
  }

  private patch(tpe: ToProcessElement): void {
    for (const i in this.other) {
      if (this.other[i].url === tpe.url) {
        this.other[i] = tpe;
        return;
      }
    }
    for (const i in this.plays) {
      if (this.plays[i].url === tpe.url) {
        this.plays[i] = tpe;
        return;
      }
    }
  }

  public onRefresh(url: string): void {
    this.doRefresh(url).subscribe(tpe => this.patch(tpe));
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  private doRefresh(url: string): Observable<ToProcessElement> {
    const options = {
      headers: new HttpHeaders().set("x-api-key", this.getApiKey())
    };
    const body = { url };
    return this.http.post("https://api.drfriendless.com/v1/update", body, options) as Observable<ToProcessElement>;
  }

  private doQuery(geek: string): Observable<ToProcessElement[]> {
    const options = {
      headers: new HttpHeaders().set("x-api-key", this.getApiKey())
    };
    return this.http.get("https://api.drfriendless.com/v1/updates/?geek=" + encodeURIComponent(geek), options) as Observable<ToProcessElement[]>;
  }
}
