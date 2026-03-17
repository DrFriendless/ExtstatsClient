import { HttpParams } from '@angular/common/http';
import { PlaysWithDate } from 'extstats-api';

export function getParamValueQueryString(paramName: string): string | undefined {
  const url = window.location.href;
  let paramValue: string | undefined = undefined;
  if (url.includes('?')) {
    const httpParams = new HttpParams({ fromString: url.split('?')[1] });
    paramValue = httpParams.get(paramName) || undefined;
  }
  return paramValue;
}

export function ymd(play: PlaysWithDate) {
  return play.year * 10000 + play.month * 100 + play.date;
}

export function ymdToString(ymd: string | number | YMD): string {
  if (typeof ymd === typeof "") ymd = parseInt(ymd as string);
  if (typeof ymd === typeof 0) {
    const year = Math.floor((ymd as number)/10000);
    const month = Math.floor((ymd as number)/100) % 100;
    const day = (ymd as number) % 100;
    ymd = { year, month, day };
  }
  const y = (ymd as YMD).year.toString();
  let m = (ymd as YMD).month.toString();
  let d = (ymd as YMD).day.toString();
  if (m.length === 1) m = `0${m}`;
  if (d.length === 1) d = `0${d}`;
  return `${y}-${m}-${d}`;
}

export interface YMD {
  year: number;
  month: number;
  day: number;
}

export function compareDate(d1: YMD, d2: YMD): number {
  const v1 = d1.year * 10000 + d1.month * 100 + d1.day;
  const v2 = d2.year * 10000 + d2.month * 100 + d2.day;
  if (v1 < v2) return -1;
  if (v1 > v2) return 1;
  return 0;
}

export function mean(vals: number[]): number {
  return vals.reduce((a, b) => a + b) / vals.length;
}

export function variance(vals: number[], mean: number): number[] {
  return vals.map(x => (x - mean) ** 2);
}

export class StddevRange {
  constructor(private mean: number, private stddev: number) {
  }

  allocate(v: number): string {
    if (v < this.mean - this.stddev / 2) {
      if (v < this.mean - this.stddev) {
        return "class1";
      } else {
        return "class2";
      }
    } else if (v > this.mean + this.stddev / 2) {
      if (v > this.mean + this.stddev) {
        return "class5";
      } else {
        return "class4";
      }
    } else {
      return "class3";
    }
  }
}

export function stddev(vals: number[]): StddevRange {
  const m = mean(vals);
  const vs = variance(vals, m);
  return new StddevRange(m, Math.sqrt(mean(vs)));
}

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Total"];
export const monthLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31];
