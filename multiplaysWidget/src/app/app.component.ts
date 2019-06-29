import { Component, OnInit, ViewChild } from "@angular/core"
import { GeekChipsComponent, PlaysSourceComponent, UserDataService } from "extstats-angular"
import { MultiGeekPlays, PlaysQuery } from "extstats-core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  selector: 'multiplays-widget',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class MultiPlaysWidget extends PlaysSourceComponent<MultiGeekPlays> implements OnInit {
  @ViewChild('chips') chips: GeekChipsComponent;
  public geeks: string[] = [];

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService);
  }

  public ngOnInit() {
    super.ngOnInit();
    const gs = this.getParamValueQueryString("geeks");
    if (gs) {
      this.geeks = gs.split(",").map(s => s.trim()).filter(s => !!s);
    }
    this.refresh();
  }

  public getId(): string {
    return "plays";
  }

  protected getQueryResultFormat(): string {
    return "MultiGeekPlays";
  }

  protected getQueryVariables(): { [p: string]: string } {
    return {};
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  public apply(): void {
    window.location.search = "geeks=" + this.geeks.join(",");
  }

  protected buildQuery(geek: string): PlaysQuery | undefined {
    console.log("buildQuery");
    console.log(geek);
    console.log(this.geeks);
    if (this.geeks.length) {
      return { geeks: this.geeks, filter: "first" } as PlaysQuery;
    } else if (geek) {
      return { geek, filter: "first ymd" };
    } else {
      return undefined;
    }
  }

  private getParamValueQueryString(paramName: string): string {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }
}
