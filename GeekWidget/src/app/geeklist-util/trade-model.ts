import {signal} from "@angular/core";

export interface TradeItem {
  name: string;
  tradeCode: string;
  link: string;
}

export class TradeModel {
  accepts: Record<string, string[]> = {};
  cash: Record<string, number> = {};
  public wantList = signal<string>("");
  public canFillDown = signal<boolean>(false);

  constructor(public geek: string, public geeklist: number, public myItems: TradeItem[], public interestingItems: TradeItem[]) {
    this.wantList.set(this.output());
  }

  moveWanted(src: number, dest: number): TradeModel {
    let l = this.interestingItems;
    const cut = l.splice(src - 1, 1);
    if (dest === 1) {
      l = [...cut, ...l];
    } else {
      l = [...l.slice(0, dest-1), ...cut, ...l.slice(dest-1)];
    }
    const result = new TradeModel(this.geek, this.geeklist, this.myItems, l);
    result.accepts = this.accepts;
    result.cash = this.cash;
    return result;
  }

  moveMine(src: number, dest: number): TradeModel {
    let l = this.myItems;
    const cut = l.splice(src - 1, 1);
    if (dest === 1) {
      l = [...cut, ...l];
    } else {
      l = [...l.slice(0, dest - 1), ...cut, ...l.slice(dest - 1)];
    }
    const result = new TradeModel(this.geek, this.geeklist, l, this.interestingItems);
    result.accepts = this.accepts;
    result.cash = this.cash;
    return result;
  }

  setAccept(mine: TradeItem, wanted: TradeItem, accept: boolean) {
    let ax = this.accepts[mine.tradeCode] || [];
    if (accept) {
      if (ax.indexOf(wanted.tradeCode) < 0) ax.push(wanted.tradeCode);
    } else {
      ax = ax.filter(s => s !== wanted.tradeCode);
    }
    this.accepts[mine.tradeCode] = ax;
    this.wantList.set(this.output());
    this.canFillDown.set(this.calcFillDown());
  }

  setCash(item: TradeItem, amount: number | undefined) {
    if (amount === undefined || amount <= 0) {
      delete this.cash[item.tradeCode];
    } else {
      this.cash[item.tradeCode] = amount;
    }
    this.wantList.set(this.output());
    this.canFillDown.set(this.calcFillDown());
  }

  willAccept(mineCode: string, wantedCode: string): boolean {
    const ax = this.accepts[mineCode];
    if (!ax) return false;
    return ax.indexOf(wantedCode) >= 0;
  }

  getCash(tradeCode: string): number | undefined {
    return this.cash[tradeCode];
  }

  output(): string {
    const lines: string[] = [];
    for (const item of this.myItems) {
      const prelude = `(${this.geek}) ${item.tradeCode}:`;
      const parts = [prelude];
      for (const want of this.interestingItems) {
        if (this.willAccept(item.tradeCode, want.tradeCode)) parts.push(want.tradeCode);
      }
      const cash = this.getCash(item.tradeCode);
      if (cash !== undefined && cash > 0) parts.push(`$${cash}`);
      lines.push(parts.join(" "));
    }
    for (const item of this.interestingItems) {
      const cash = this.getCash(item.tradeCode);
      if (cash !== undefined && cash > 0) {
        const line = `(${this.geek}) $${cash}: ${item.tradeCode}`;
        lines.push(line);
      }
    }
    return lines.join("\n");
  }

  calcFillDown() {
    let lastItem: string | undefined = undefined;
    let lastColumn: number | undefined = undefined;
    let firstRowInLastColumn: number | undefined = undefined;
    for (const wi in this.interestingItems) {
      const want = this.interestingItems[wi];
      let first: number | undefined = undefined;
      let firstItem: string | undefined = undefined;
      for (const mi in this.myItems) {
        const mine = this.myItems[mi];
        if (this.willAccept(mine.tradeCode, want.tradeCode)) {
          first = parseInt(mi);
          firstItem = mine.tradeCode;
          break;
        }
      }
      if (first === undefined) first = this.myItems.length;
      if (lastColumn === undefined) {
        lastColumn = parseInt(wi);
        firstRowInLastColumn = first;
        lastItem = firstItem;
      } else {
        if (firstRowInLastColumn! > first) {
          if (lastItem) console.log(`conflict between ${firstItem} and ${lastItem}`);
          return false;
        } else {
          lastColumn = parseInt(wi);
          firstRowInLastColumn = first;
          lastItem = firstItem;
        }
      }
    }
    return true;
  }

  fillDown(): void {
    for (const want of this.interestingItems) {
      let turnOn = false;
      for (const mine of this.myItems) {
        if (turnOn) {
          this.setAccept(mine, want, true);
        } else if (this.willAccept(mine.tradeCode, want.tradeCode)) {
          turnOn = true;
        }
      }
    }
  }

  clear(): void {
    for (const want of this.interestingItems) {
      for (const mine of this.myItems) {
        this.setAccept(mine, want, false);
      }
    }
  }
}
