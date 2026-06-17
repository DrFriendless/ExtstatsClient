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

  constructor(public geek: string, public geeklist: number, public myItems: TradeItem[], public interestingItems: TradeItem[]) {
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
  }

  setCash(item: TradeItem, amount: number | undefined) {
    if (amount === undefined || amount <= 0) {
      delete this.cash[item.tradeCode];
    } else {
      this.cash[item.tradeCode] = amount;
    }
    this.wantList.set(this.output());
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
}
