import {Component, viewChildren} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ExtstatsApi, GeeklistCheck, GeeklistItemCheck} from "extstats-api";
import {LoaderComponent, SwitchComponent} from "extstats-angular";
import {NgClass} from "@angular/common";
import {MoveEvent, TradeItemComponent} from "../trade-item/trade-item.component";
import {AcceptComponent} from "../accept/accept.component";
import {CashComponent} from "../cash/cash.component";
import {TradeModel} from "./trade-model";

const RE = /^(.*\/geeklist\/)?([0-9]+)(\/.*)?$/;

@Component({
  selector: 'geeklist-util',
  templateUrl: './geeklist-util.component.html',
  styleUrl: './geeklist-util.component.css',
  imports: [
    FormsModule,
    NgClass,
    LoaderComponent,
    SwitchComponent,
    TradeItemComponent,
    AcceptComponent,
    CashComponent
  ],
  standalone: true
})
export class GeeklistUtilComponent {
  public geeklistId: string =  "";
  public tradeList = true;
  public tradeOnly = false;
  public interestOnly = false;
  public geek: string | undefined;
  public checkResult: GeeklistCheck | undefined;
  public loading = false;
  public error = "";
  public hasTradeCodes = false;
  public model: TradeModel | undefined = undefined;
  private accepts = viewChildren(AcceptComponent);

  constructor(private api: ExtstatsApi) {
  }

  public async checkSBGJ() {
    this.error = "";
    this.tradeList = false;
    this.geeklistId = "318181";
    this.interestOnly = true;
    this.tradeOnly = false;
    await this.doCheck(318181);
  }

  public async check() {
    this.interestOnly = false;
    this.error = "";
    const orig = this.geeklistId.trim();
    const match = orig.match(RE);
    let n: number | undefined;
    if (match) {
      const id = match[2];
      console.log(id);
      n = parseInt(id);
    } else {
      console.log("no match");
    }
    if (!n) {
      this.error = "I can't understand the geeklist";
      return;
    }
    this.checkResult = undefined;
    await this.doCheck(n);
  }

  private async doCheck(n: number) {
    this.loading = true;
    try {
      this.checkResult = await this.api.checkGeeklist(n, this.tradeList);
    } catch (err) {
      // TODO - display error
      console.log(err);
    }
    this.loading = false;
    this.hasTradeCodes = (this.checkResult && this.checkResult.items && (this.checkResult.items.filter(i => !!i.tradeCode).length > 0)) || false;
    if (this.checkResult) {
      const myItems = this.checkResult.items
        .filter(i => i.tradeCode && this.calcClass(i) === "yours")
        .map(i => {
          return {
            link: `https://boardgamegeek.com/geeklist/${n}?itemid=${i.id}`,
            name: i.name,
            tradeCode: i.tradeCode!
          }
        });
      const interestingItems = this.checkResult.items
        .filter(i => i.tradeCode && ["trade", "buy"].indexOf(this.calcClass(i)) >= 0)
        .map(i => {
          return {
            link: `https://boardgamegeek.com/geeklist/${n}?itemid=${i.id}`,
            name: i.name,
            tradeCode: i.tradeCode!
          }
        });
      this.model = new TradeModel(this.checkResult.geek, n, myItems, interestingItems);
    }
  }

  canFillDown() {
    return this.model && this.model.canFillDown();
  }

  moveWanted(event: MoveEvent) {
    this.model = this.model!.moveWanted(event.original, event.destination);
  }

  moveMine(event: MoveEvent) {
    this.model = this.model!.moveMine(event.original, event.destination);
  }

  showItem(item: GeeklistItemCheck): boolean {
    if (this.tradeOnly) {
      const cls = this.calcClass(item);
      return ["yours", "trade", "buy"].indexOf(cls) >= 0;
    } else if (this.interestOnly) {
      return item.wit || item.wtb || item.owned || (item.wishlist >= 1 && item.wishlist <= 4);
    } else {
      return true;
    }
  }

  calcClass(item: GeeklistItemCheck): string {
    if (item.user === this.checkResult?.geek) return "yours";
    if (item.wit) return "trade";
    if (item.wtb || (item.wishlist == 1 || item.wishlist == 2)) return "buy";
    if (item.owned) return "owned";
    if (item.wtp || (item.wishlist == 3 || item.wishlist == 4)) return "play";
    if (item.prevOwned) return "prevOwned";
    return "uninterested";
  }

  calcDetails(item: GeeklistItemCheck): string {
    const deets: string[] = [];
    if (item.user === this.checkResult?.geek) deets.push("this is your item");
    if (item.wtb) deets.push("want to buy");
    if (item.wtp) deets.push("want to play");
    if (item.wit) deets.push("want in trade");
    if (item.owned) deets.push("owned");
    if (item.prevOwned) deets.push("previously owned");
    if (item.wishlist > 0) deets.push(`wishlist ${item.wishlist}`);
    if (item.tradeCode) deets.push(item.tradeCode);
    if (deets.length === 0) deets.push("(no information)");
    return deets.join(", ");
  }

  syncAcceptsToModel() {
    if (!this.model) return;
    const ax = this.accepts();
    for (const ac of ax) {
      ac.accept.set(this.model.willAccept(ac.mine().tradeCode, ac.want().tradeCode));
    }
  }

  fillDown() {
    if (this.model) {
      this.model.fillDown();
      this.syncAcceptsToModel();
    }
  }

  clear() {
    if (this.model) {
      this.model.clear();
      this.syncAcceptsToModel();
    }
  }
}
