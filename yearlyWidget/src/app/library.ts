export class Counter {
  private counts: Record<string, number> = {};

  add(key: string | number, quantity: number) {
    const n = this.get(key);
    this.counts[key] = n + quantity;
  }

  get(key: string | number): number {
    return this.counts[key] || 0;
  }

  cmp(a: string | number, b: string | number): number {
    return this.get(a) - this.get(b);
  }

  desc(): string[] {
    const keys = Object.keys(this.counts);
    keys.sort((a, b) => this.cmp(b, a));
    return keys;
  }

  descfunc(f: (string) => string): string[] {
    const keys = Object.keys(this.counts);
    keys.sort((a, b) => {
      let v = this.cmp(b, a);
      if (v === 0) v = f(a).localeCompare(f(b));
      return v;
    });
    return keys;
  }
}

export function ymdToDate(ymd: number | string): Date {
  if (typeof ymd === "string") ymd = parseInt(ymd);
  const y = Math.floor(ymd / 10000);
  const d = ymd % 100;
  const m = Math.floor(ymd / 100) % 100;
  return new Date(y, m - 1, d);
}
