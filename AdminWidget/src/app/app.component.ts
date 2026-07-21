import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/internal/Subscription";
import {ExtstatsApi, SystemStats} from "extstats-api";
import {LoaderComponent} from "extstats-angular";

@Component({
  selector: 'extstats-admin',
  imports: [
    LoaderComponent
  ],
  templateUrl: './app.component.html'
})
export class ExtStatsAdminComponent implements AfterViewInit, OnDestroy {
  public stats: SystemStats | undefined;
  private subscription: Subscription | undefined;
  days: (Day & { label: string })[] = [];
  loading = false;

  constructor(private api: ExtstatsApi) { }

  public async ngAfterViewInit(): Promise<void> {
    await this.refresh();
  }

  public ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public async refresh() {
    this.loading = true;
    this.stats = await this.api.getSystemStats();
    this.loading = false;
    let index = 0;
    const yesterday: Day & { label: string } = {
      label: "last 24 hours",
      index: -1,
      processPlayed: 0,
      processUser: 0,
      processGame: 0,
      processCollection: 0,
      processYear: 0,
      processPlayedLabel: "",
      processUserLabel: "",
      processGameLabel: "",
      processCollectionLabel: "",
      processYearLabel: ""
    };
    this.days.push(yesterday);
    for (const entry of this.stats.last24) {
      if (entry.type === "processPlayed") {
        yesterday.processPlayed = entry.count / 10;
        yesterday.processPlayedLabel = entry.count.toString();
      } else if (entry.type === "processUser") {
        yesterday.processUser = entry.count / 10;
        yesterday.processUserLabel = entry.count.toString();
      } else if (entry.type === "processGame") {
        yesterday.processGame = entry.count / 10;
        yesterday.processGameLabel = entry.count.toString();
      } else if (entry.type === "processCollection") {
        yesterday.processCollection = entry.count / 10;
        yesterday.processCollectionLabel = entry.count.toString();
      } else if (entry.type === "processYear") {
        yesterday.processYear = entry.count / 10;
        yesterday.processYearLabel = entry.count.toString();
      }
    }
    const total = {
      processPlayed: 0,
      processUser: 0,
      processGame: 0,
      processCollection: 0,
      processYear: 0
    };
    for (const upcoming of this.stats.upcoming) {
      const day: Day & { label: string } = {
        label: `in ${index} days`,
        index,
        processPlayed: 0,
        processUser: 0,
        processGame: 0,
        processCollection: 0,
        processYear: 0,
        processPlayedLabel: "",
        processUserLabel: "",
        processGameLabel: "",
        processCollectionLabel: "",
        processYearLabel: ""
      };
      if (index == 0) day.label = "next 24 hours";
      for (const entry of upcoming) {
        if (entry.type === "processPlayed") {
          day.processPlayed = (entry.count - total.processPlayed) / 10;
          day.processPlayedLabel = (entry.count - total.processPlayed).toString();
          total.processPlayed += entry.count;
        } else if (entry.type === "processUser") {
          day.processUser = (entry.count - total.processUser) / 10;
          day.processUserLabel = (entry.count - total.processUser).toString();
          total.processUser += entry.count;
        } else if (entry.type === "processGame") {
          day.processGame = (entry.count - total.processGame) / 10;
          day.processGameLabel = (entry.count - total.processGame).toString();
          total.processGame += entry.count;
        } else if (entry.type === "processCollection") {
          day.processCollection = (entry.count - total.processCollection) / 10;
          day.processCollectionLabel = (entry.count - total.processCollection).toString();
          total.processCollection += entry.count;
        } else if (entry.type === "processYear") {
          day.processYear = (entry.count - total.processYear) / 10;
          day.processYearLabel = (entry.count - total.processYear).toString();
          total.processYear += entry.count;
        }
      }
      this.days.push(day);
      index++;
    }
    console.log(this.days);
  }
}

interface Day {
  index: number;
  processPlayed: number;
  processPlayedLabel: string;
  processUser: number;
  processUserLabel: string;
  processGame: number;
  processGameLabel: string;
  processCollection: number;
  processCollectionLabel: string;
  processYear: number;
  processYearLabel: string;
}
