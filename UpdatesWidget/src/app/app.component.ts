import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ToProcessElement } from "extstats-core";
import {LoaderComponent, UserConfigService} from "extstats-angular";
import { switchMap } from "rxjs/operators";
import dateFormat from "dateformat";
import {ExtstatsApi} from "extstats-api";
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
    forGeek: ToProcessElement[];
    forSystem: Record<string, number>;
  }> | undefined;
  private subject = new Subject<any>();
  other: ToProcessElement[] = [];
  plays: ToProcessElement[] = [];
  geek: string | undefined = undefined;
  downloaderQueue: Record<string, number> = {};
  loading = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService, private socks: WebSocketService) {
  }

  ngOnInit(): void {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.data$ = this.subject
        .asObservable()
        .pipe(
          switchMap(() => this.doQuery(this.geek!).then())
        ) as Observable<{
        forGeek: ToProcessElement[];
        forSystem: Record<string, number>;
      }>;
      this.data$.subscribe(vs => this.processData(vs));
      this.subject.next(undefined);
      const chatterId = this.socks.getChatterId();
      if (chatterId) {
        this.socks.connect(`wss://socks.drfriendless.com/?geek=${this.geek}&id=${chatterId}`);
        this.socks.messages$.subscribe({
          next: (message) => console.log(`M $message`)
        })
      }
    }
  }

  private processData(data: {
    forGeek: ToProcessElement[];
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
    this.doRefresh(url).then(tpe => this.patch(tpe));
  }

  onRefreshOld(): void {
    this.doRefreshOld(this.geek!).then(urls => urls.forEach(url => this.noLastUpdate(url)));
  }

  private async doRefreshOld(geek: string): Promise<string[]> {
    return await this.api.updateOld(geek);
  }

  private async doRefresh(url: string): Promise<ToProcessElement> {
    return await this.api.markForUpdate(url)
  }

  private async doQuery(geek: string): Promise<{
    forGeek: ToProcessElement[];
    forSystem: Record<string, number>;
  }> {
    this.loading = true;
    const d = await this.api.getUpdates(geek);
    this.loading = false;
    return d;
  }

  protected readonly Object = Object;
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
