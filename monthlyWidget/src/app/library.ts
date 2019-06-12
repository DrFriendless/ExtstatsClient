export function ym(play: { year: number, month: number }) {
  return play.year * 100 + play.month;
}

export function setToArray<T>(set: Set<T>): T[] {
  const result: T[] = [];
  set.forEach(t => result.push(t));
  return result;
}

export function makeKeySingle(ym: number): string {
  return makeKey(Math.floor(ym / 100), ym % 100);
}

export function makeKey(year: number, month: number): string {
  if (month >= 10) return "" + year + "-" + month;
  return "" + year + "-0" + month;
}

export function sum(nums: number[]): number {
  return nums.reduce(function(a, b) { return a + b; }, 0);
}
