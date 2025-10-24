import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject } from "rxjs/internal/Subject";
import { Subscription } from "rxjs/internal/Subscription";
import { Observable } from "rxjs/internal/Observable";
import { mergeMap, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { FAQCount } from "extstats-core";
import { GeekComboComponent } from "extstats-angular";
import {environment} from "../environments/environment";

interface FAQ {
  index: number;
  head: string;
  body: string;
}

@Component({
  selector: 'extstats-faq',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    GeekComboComponent
  ]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  public selected = 0;
  private clicks = new Subject<number[]>();
  private readonly subscription: Subscription;
  private readonly faqSubscription: Subscription;
  public faqCounts: { [index: number]: FAQCount } = {};
  public faqs: FAQ[] = [];
  public geek: string | undefined;

  constructor(private http: HttpClient) {
    this.subscription = this.clicks.asObservable().pipe(
      mergeMap(clix => this.http.post(`${environment.api}/faqcount`, clix)))
      .subscribe(faqData => {
        this.indexFAQData(faqData as FAQCount[]);
      });
    this.faqSubscription = (this.http.get("/json/en/doc/faqs.json") as Observable<object[]>).pipe(
      tap(x => console.log(x)),
    ).subscribe(faqs => this.faqs = faqs as FAQ[]);
  }

  public ngAfterViewInit() {
    this.clicks.next([]);
  }

  public ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.faqSubscription) this.faqSubscription.unsubscribe();
  }

  private indexFAQData(faqData: FAQCount[]) {
    let i = 0;
    while (i < faqData.length) {
      this.faqCounts[i + 1] = faqData[i];
      i++;
    }
  }

  public toggle(index: number) {
    console.log("toggle " + index);
    if (this.selected === index) {
      this.selected = 0;
    } else {
      this.selected = index;
      this.clicks.next([index]);
    }
    console.log(this.selected);
  }

  public getCount(index: number, key: keyof FAQCount): number {
    if (!this.faqCounts[index]) return 0;
    return this.faqCounts[index][key];
  }

  public choose(event: string) {
    console.log(event);
    this.geek = event;
  }
}
