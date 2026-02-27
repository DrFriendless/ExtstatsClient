import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ExtstatsApi, GeeklistCheck, GeeklistItemCheck} from "extstats-api";
import {LoaderComponent, UserConfigService} from "extstats-angular";
import {NgClass} from "@angular/common";

const RE = /^(.*\/geeklist\/)?([0-9]+)(\/.*)?$/;

@Component({
  selector: 'geeklist-util',
  templateUrl: './geeklist-util.component.html',
  styleUrl: './geeklist-util.component.css',
  imports: [
    FormsModule,
    NgClass,
    LoaderComponent
  ],
  standalone: true
})
export class GeeklistUtilComponent {
  public geeklistId: string =  "";
  public geek: string | undefined;
  public checkResult: GeeklistCheck | undefined;
  public loading = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  public async check() {
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
      console.log("don't like that geeklist");
      return;
    }
    this.checkResult = undefined;
    this.loading = true;
    // TODO - display error
    this.checkResult = await this.api.checkGeeklist(n);
    this.loading = false;
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
    if (deets.length === 0) deets.push("(no information)");
    return deets.join(", ");
  }
}
