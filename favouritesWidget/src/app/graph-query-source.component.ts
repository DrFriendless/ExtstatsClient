import { AfterViewInit, Injectable, OnInit } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { UserDataService } from "extstats-angular"
import { flatMap, tap, share, map } from "rxjs/internal/operators"
import { Observable, Subject } from "rxjs"

@Injectable()
export abstract class GraphQuerySourceComponent<T> implements AfterViewInit, OnInit {
  protected geek: string;
  private queries = new Subject<any>();
  data$: Observable<T>;
  loading = false;

  protected constructor(private http: HttpClient, private userDataService: UserDataService) {
    this.data$ = this.queries.asObservable()
      .pipe(
        tap(() => this.loading = true),
        flatMap(() => this.doQuery()),
        tap(() => this.loading = false),
        map(x => x["data"]),
        share()
      );
  }

  ngOnInit(): void {
    this.userDataService.init();
    this.geek = this.userDataService.getAGeek();
  }

  private doQuery(): Observable<T> {
    const options = {
      headers: new HttpHeaders().set("x-api-key", this.getApiKey())
    };
    const query = "?query=" + encodeURIComponent(this.buildQuery(this.geek));
    return this.http.get("https://api.drfriendless.com/v1/retrieve" + query, options) as Observable<T>;
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.queries.next(null);
  }

  protected abstract buildQuery(geek: string): string;

  protected abstract getApiKey(): string;
}
