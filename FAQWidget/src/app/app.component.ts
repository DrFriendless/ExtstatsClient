import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import { Subject } from "rxjs/internal/Subject";
import { Subscription } from "rxjs/internal/Subscription";
import { mergeMap } from "rxjs/operators";
import { GeekComboComponent } from "extstats-angular";
import {ExtstatsApi, FAQCount} from "extstats-api";

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
  public faqCounts: { [index: number]: FAQCount } = {};
  public faqs: FAQ[] = [];
  public geek: string | undefined;

  constructor(private api: ExtstatsApi) {
    this.subscription = this.clicks.asObservable().pipe(
      mergeMap(clix => this.api.incFAQCount(clix)))
      .subscribe(faqData => {
        this.indexFAQData(faqData as FAQCount[]);
      });
  }

  public async ngAfterViewInit() {
    this.faqs = await (await fetch("/json/en/doc/faqs.json")).json()
    this.clicks.next([]);
  }

  public ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
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
