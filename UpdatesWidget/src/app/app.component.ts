import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {LoaderComponent, UserConfigService} from "extstats-angular";
import { switchMap } from "rxjs/operators";
import dateFormat from "dateformat";
import {ExtstatsApi, ToProcessSummary} from "extstats-api";
import {WebSocketService} from "./websocket.service";

@Component({
  selector: 'extstats-updates',
  imports: [
    LoaderComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private data$: Observable<{
    forGeek: ToProcessSummary[];
    forSystem: Record<string, number>;
  }> | undefined;
  private subject = new Subject<boolean>();
  other: ToProcessSummary[] = [];
  plays: ToProcessSummary[] = [];
  geek: string | undefined = undefined;
  downloaderQueue: Record<string, number> = {};
  loading = false;
  disableRecalculatePlays = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService, private socks: WebSocketService) {
  }

  ngOnInit(): void {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.data$ = this.subject
        .asObservable()
        .pipe(
          switchMap((quiet: boolean) => this.doQuery(this.geek!, quiet).then())
        ) as Observable<{
        forGeek: ToProcessSummary[];
        forSystem: Record<string, number>;
      }>;
      this.data$.subscribe(vs => this.processData(vs));
      this.subject.next(false);
      const chatterId = this.socks.getChatterId();
      if (chatterId && this.geek === this.userService.getLoggedInGeek()) {
        this.socks.connect(`wss://socks.drfriendless.com/?geek=${this.userService.getLoggedInGeek()}&id=${chatterId}&topic=updates`);
        this.socks.messages$.subscribe({
          next: (message) => {
            console.log(JSON.stringify(message));
            this.onRefreshAll(true);
          }
        });
      }
    }
  }

  private processData(data: {
    forGeek: ToProcessSummary[];
    forSystem: Record<string, number>;
  }) {
    this.other = [];
    this.plays = [];
    for (const tpe of data.forGeek) {
      tpe.lastUpdate = transform(tpe.lastUpdate);
      tpe.nextUpdate = transform(tpe.nextUpdate);
      if (tpe.processMethod === 'processYear') {
        this.plays.push(tpe);
      } else {
        this.other.push(tpe);
      }
    }
    this.plays.sort(byDateDescending);
    this.downloaderQueue = data.forSystem;
  }

  private patch(tpe: ToProcessSummary): void {
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

  onRefreshAll(quiet: boolean): void {
    this.subject.next(quiet);
  }

  onRefresh(url: string): void {
    this.doRefresh(url).then(tpe => this.patch(tpe));
  }

  onRefreshOld(): void {
    this.doRefreshOld(this.geek!).then(urls => urls.forEach(url => this.noLastUpdate(url)));
  }

  async onRecalculatePlays(): Promise<void> {
    this.disableRecalculatePlays = true;
    await this.api.recalculatePlays(this.geek!);
  }

  private async doRefreshOld(geek: string): Promise<string[]> {
    return await this.api.updateOld(geek);
  }

  private async doRefresh(url: string): Promise<ToProcessSummary> {
    return await this.api.markForUpdate(url)
  }

  private async doQuery(geek: string, quiet: boolean): Promise<{
    forGeek: ToProcessSummary[];
    forSystem: Record<string, number>;
  }> {
    if (!quiet) this.loading = true;
    const d = await this.api.getUpdates(geek);
    this.loading = false;
    return d;
  }

  protected readonly Object = Object;
}

function byDateDescending(t1: ToProcessSummary, t2: ToProcessSummary): number {
  let c = t1.year - t2.year;
  if (c === 0) c = t1.month - t2.month;
  return -c;
}

function transform(s: string) {
  if (!s) return "";
  return dateFormat(new Date(s), "h:MM:sstt d mmm yy");
}
