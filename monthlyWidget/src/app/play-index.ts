import { GameData } from "extstats-core"
import { setToArray, ym } from "./library"
import {CountData, MonthlyData, PlayData } from "./app.component";

export type GameID = number;
export type PlayCount = number;
export type YearTo<A> = Record<number, A>;
export type MonthTo<A> = Record<number, A>;
export type GameTo<A> = Record<GameID, A>;
export type GamePlays = GameTo<PlayCount>;

export type NickelDime = { nickel: Set<GameID>, dime: Set<GameID>, quarter: Set<GameID>, dollar: Set<GameID> };
export type TotalPlays = { count: PlayCount, distinct: PlayCount, new: Set<GameID>, played: Set<GameID>, byGame: GamePlays };
export type GameIndex = { [bggid: number]: GameData };

export type PlayAndGamesIndex = {
  everPlayIndex: PlayIndex
  gamesIndex: GameIndex
  years: number[]
  months: number[]
  datesIndex: Record<string, number>
  ownedGames: Set<GameID>
  everPlaysPerMonth: MonthTo<GamePlays>
  yearlyPlaysPerMonth: YearTo<MonthTo<GamePlays>>
};

export function indexPlays(data: MonthlyData): PlayAndGamesIndex {
  if (!data) {
    return { everPlayIndex: new PlayIndex(), years: [], months: [], datesIndex: {}, gamesIndex: {},
      ownedGames: new Set<number>(), everPlaysPerMonth: {}, yearlyPlaysPerMonth: {} };
  }
  const plays = data.plays;
  plays.sort((a, b) => ym(a) - ym(b));
  const everPlayIndex = new PlayIndex();
  const yearPlayIndices: YearTo<PlayIndex> = {};
  const years: number[] = [];
  const yearMonths: number[] = [];
  const everPlaysPerMonth: Record<number, GamePlays> = {};
  const yearlyPlaysPerMonth: Record<number, Record<number, GamePlays>> = {};
  let lastYearMonth = -1;
  let lastYear = -1;
  for (const mp of plays) {
    if (years.indexOf(mp.year) < 0) years.push(mp.year);
    const ym = mp.year * 100 + mp.month;
    if (ym != lastYearMonth && lastYearMonth >= 0) {
      everPlaysPerMonth[lastYearMonth] = everPlayIndex.snapshotEverPlaysPerGame();
      if (ym != lastYearMonth) {
        if (!yearlyPlaysPerMonth[lastYear]) yearlyPlaysPerMonth[lastYear] = {};
        yearlyPlaysPerMonth[lastYear][lastYearMonth] = everPlayIndex.snapshotYearPlaysPerGame(lastYear);
      }
    }
    lastYearMonth = ym;
    lastYear = mp.year;
    if (yearMonths.indexOf(ym) < 0) yearMonths.push(ym);
    if (!yearPlayIndices[mp.year]) {
      yearPlayIndices[mp.year] = new PlayIndex();
    }
    const yearPlayIndex = yearPlayIndices[mp.year];
    yearPlayIndex.addPlays(mp);
    everPlayIndex.addPlays(mp);
  }
  const datesIndex = makeDatesIndex(data.counts);
  if (!yearlyPlaysPerMonth[lastYear]) yearlyPlaysPerMonth[lastYear] = {};
  yearlyPlaysPerMonth[lastYear][lastYearMonth] = everPlayIndex.snapshotYearPlaysPerGame(lastYear);
  const ownedGames = new Set<number>();
  const gamesIndex = {}
  data.geekGames.forEach(gg => {
    if (gg.owned) ownedGames.add(gg.game.bggid);
    gamesIndex[gg.game.bggid] = gg.game;
  } );
  years.sort();
  yearMonths.sort();
  return { everPlayIndex, years, months: yearMonths, datesIndex, gamesIndex, ownedGames, everPlaysPerMonth, yearlyPlaysPerMonth };
}

/**
 * A set of plays with dates, indexed for easy retrieval of useful data.
 */
export class PlayIndex {
  private indexByPeriod: Record<number, PlayData[]> = {};
  // new games played in period
  private newIndexByPeriod: Record<number, Set<GameID>> = {};
  private playedInPeriod: Record<number, Set<GameID>> = {};
  private everPlayed = new Set<GameID>();
  // plays ever of each game - game to count
  private playsPerGame: GameTo<PlayCount> = {};
  private yearPlaysPerGame: YearTo<GamePlays> = {};
  private everNDs: Record<number, NickelDime> = {};
  private yearlyNDs: MonthTo<NickelDime> = {};

  addPlays(pwd: PlayData) {
    if (!this.playsPerGame[pwd.bggid]) this.playsPerGame[pwd.bggid] = 0;
    if (!this.yearPlaysPerGame[pwd.year]) this.yearPlaysPerGame[pwd.year] = {};
    if (!this.yearPlaysPerGame[pwd.year][pwd.bggid]) this.yearPlaysPerGame[pwd.year][pwd.bggid] = 0;
    const before = this.playsPerGame[pwd.bggid];
    const after = before + pwd.quantity;
    const yearBefore = this.yearPlaysPerGame[pwd.year][pwd.bggid];
    const yearAfter = yearBefore + pwd.quantity;
    const y = pwd.year;
    const m = pwd.year * 100 + pwd.month;
    this.addPlayForPeriod(y, pwd);
    this.addPlayForPeriod(m, pwd);
    if (after >= 5) {
      if (!this.everNDs[pwd.year]) this.everNDs[pwd.year] = emptyNickelAndDime();
      if (!this.everNDs[m]) this.everNDs[m] = emptyNickelAndDime();
      updateNickelsAndDimes(pwd.bggid, before, after, this.everNDs[y]);
      updateNickelsAndDimes(pwd.bggid, before, after, this.everNDs[m]);
    }
    if (yearAfter >= 5) {
      if (!this.yearlyNDs[m]) this.yearlyNDs[m] = emptyNickelAndDime();
      updateNickelsAndDimes(pwd.bggid, yearBefore, yearAfter, this.yearlyNDs[m]);
    }
    this.playsPerGame[pwd.bggid] = after;
    this.yearPlaysPerGame[pwd.year][pwd.bggid] = yearAfter;
    this.everPlayed.add(pwd.bggid);
  }

  snapshotEverPlaysPerGame(): GamePlays {
    return {...this.playsPerGame}
  }

  snapshotYearPlaysPerGame(year: number): GamePlays {
    if (!this.yearPlaysPerGame[year]) return {};
    return { ...this.yearPlaysPerGame[year] };
  }



  private addPlayForPeriod(period: number, pwd: PlayData) {
    if (!this.indexByPeriod[period]) {
      this.indexByPeriod[period] = [pwd];
    } else {
      this.indexByPeriod[period].push(pwd);
    }
    if (!this.playedInPeriod[period]) this.playedInPeriod[period] = new Set<number>();
    this.playedInPeriod[period].add(pwd.bggid);
    if (!this.everPlayed.has(pwd.bggid)) {
      if (!this.newIndexByPeriod[period]) {
        this.newIndexByPeriod[period] = new Set<number>([pwd.bggid]);
      } else {
        this.newIndexByPeriod[period].add(pwd.bggid);
      }
    }
  }

  getTotalPlays(period: number): TotalPlays {
    let total = 0;
    const gamePlays = {};
    const ids = new Set<number>();
    const plays = this.indexByPeriod[period] || [];
    for (const p of plays) {
      if (!p.expansion) total += p.quantity;
      const before = gamePlays[p.bggid] || 0;
      gamePlays[p.bggid] = before + p.quantity;
      ids.add(p.bggid);
    }
    const newGames = !!this.newIndexByPeriod[period] ? this.newIndexByPeriod[period] : new Set<number>();
    return { count: total, distinct: ids.size, new: newGames, played: ids, byGame: gamePlays };
  }

  getPlays(period: number): PlayData[] {
    return this.indexByPeriod[period];
  }

  getEverNickelAndDimes(period: number): NickelDime {
    if (!this.everNDs[period]) {
      return { nickel: new Set(), dime: new Set(), quarter: new Set(), dollar: new Set() };
    } else {
      return this.everNDs[period];
    }
  }

  getYearlyNickelAndDimes(period: number): NickelDime {
    return this.yearlyNDs[period] || emptyNickelAndDime();
  }

  getNewGames(period: number): Set<number> {
    return this.newIndexByPeriod[period];
  }

  getYearKeys(): number[] {
    const result: number[] = [];
    for (const period in Object.keys(this.indexByPeriod)) {
      if (period.length === 4) {
        result.push(parseInt(period));
      }
    }
    return result;
  }

  getMonthKeys(): number[] {
    const result: number[] = [];
    for (const period of Object.keys(this.indexByPeriod).filter(k => k.length === 6)) {
      result.push(parseInt(period));
    }
    return result;
  }
}

export function gameNames(ids: Set<number>, gameIndex: GameIndex): string[] {
  return setToArray(ids).map(id => gameIndex[id].name);
}

export function splitExpansions(ids: Set<number>, gameIndex: GameIndex): { base: Set<number>, expansions: Set<number> } {
  const base = new Set<number>();
  const expansions = new Set<number>();
  ids.forEach(id => {
    if (gameIndex[id].isExpansion) {
      expansions.add(id);
    } else {
      base.add(id);
    }
  });
  return { base, expansions };
}

export function buildTooltip(gameIndex: GameIndex, games: Set<number>) {
  return setToArray(games).map(id => gameIndex[id].name).join(", ");
}

function makeDatesIndex(mpcs: CountData[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const mpc of mpcs) {
    result[ym(mpc)] = mpc.count;
  }
  return result;
}

function emptyNickelAndDime(): NickelDime {
  return {
    nickel: new Set<GameID>(),
    dime: new Set<GameID>(),
    quarter: new Set<GameID>(),
    dollar: new Set<GameID>()
  };
}

export function calcHIndex(plays: GamePlays): number {
  if (!plays) return 0;
  const values: PlayCount[] = Object.values(plays);
  values.sort((a, b) => b - a);
  let hindex = 0;
  while (hindex < values.length && values[hindex] > hindex) hindex++;
  return hindex;
}

export function calcHoursPlayed(plays: GamePlays, gameIndex: GameIndex): number {
  let total = 0;
  Object.keys(plays).forEach(bggid => {
    const quantity = plays[bggid];
    const game: GameData = gameIndex[bggid];
    total += quantity * game.playTime;
  });
  return total;
}

export function calcPercentPlayed(owned: Set<GameID>, played: Set<GameID>): number {
  if (owned.size == 0) return 100;
  let count = 0;
  played.forEach(p => {
    if (owned.has(p)) count++;
  });
  return Math.floor((count * 10000) / owned.size) / 100;
}

function updateNickelsAndDimes(game: GameID, before: PlayCount, after: PlayCount, nd: NickelDime): void {
  if (before < 5 && after >= 5) {
    nd.nickel.add(game);
  }
  if (before < 10 && after >= 10) {
    nd.dime.add(game);
  }
  if (before < 25 && after >= 25) {
    nd.quarter.add(game);
  }
  if (before < 100 && after >= 100) {
    nd.dollar.add(game);
  }
}
