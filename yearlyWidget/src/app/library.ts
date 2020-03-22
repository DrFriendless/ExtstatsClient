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
}
