import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/internal/Subscription";
import {ExtstatsApi} from "extstats-api";
import {SystemStats} from "extstats-core";

@Component({
  selector: 'extstats-admin',
  templateUrl: './app.component.html'
})
export class ExtStatsAdminComponent implements AfterViewInit, OnDestroy {
  public stats: SystemStats | undefined;
  private subscription: Subscription | undefined;

  constructor(private api: ExtstatsApi) { }

  public async ngAfterViewInit(): Promise<void> {
    this.stats = await this.api.getSystemStats();
  }

  public ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public async refresh() {
    this.stats = await this.api.getSystemStats();
  }
}
