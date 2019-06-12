import { CollectionWithMonthlyPlays, GameData, makeGamesIndex, MonthlyPlayCount, MonthlyPlays } from "extstats-core"
import { setToArray, ym } from "./library"

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

export function indexPlays(data: CollectionWithMonthlyPlays): PlayAndGamesIndex {
  if (data) {
    const plays = data.plays;
    if (!plays || plays.length === 0) return;
    plays.sort((a, b) => ym(a) - ym(b));
    const everPlayIndex = new PlayIndex();
    const yearPlayIndices: YearTo<PlayIndex> = {};
    const years: number[] = [];
    const months: number[] = [];
    const everPlaysPerMonth = {};
    const yearlyPlaysPerMonth = {};
    let lastMonth = -1;
    let lastYear = -1;
    for (const mp of plays) {
      if (years.indexOf(mp.year) < 0) years.push(mp.year);
      const m = mp.year * 100 + mp.month;
      if (m != lastMonth && lastMonth >= 0) {
        everPlaysPerMonth[lastMonth] = everPlayIndex.snapshotEverPlaysPerGame();
        if (m != lastMonth) {
          if (!yearlyPlaysPerMonth[lastYear]) yearlyPlaysPerMonth[lastYear] = {};
          yearlyPlaysPerMonth[lastYear][lastMonth] = everPlayIndex.snapshotYearPlaysPerGame(lastYear);
        }
      }
      lastMonth = m;
      lastYear = mp.year;
      if (months.indexOf(m) < 0) months.push(m);
      if (!yearPlayIndices[mp.year]) {
        yearPlayIndices[mp.year] = new PlayIndex();
      }
      const yearPlayIndex = yearPlayIndices[mp.year];
      yearPlayIndex.addPlays(mp);
      everPlayIndex.addPlays(mp);
    }
    if (!yearlyPlaysPerMonth[lastYear]) yearlyPlaysPerMonth[lastYear] = {};
    yearlyPlaysPerMonth[lastYear][lastMonth] = everPlayIndex.snapshotYearPlaysPerGame(lastYear);
    const gamesIndex = makeGamesIndex(data.games);
    const datesIndex = makeDatesIndex(data.counts);
    const ownedGames = new Set<number>();
    data.collection.forEach(gg => {
      if (gg.owned) ownedGames.add(gg.bggid);
    } );
    years.sort();
    months.sort();
    return { everPlayIndex, gamesIndex, years, months, datesIndex, ownedGames, everPlaysPerMonth, yearlyPlaysPerMonth};
  } else {
    return { everPlayIndex: new PlayIndex(), gamesIndex: {}, years: [], months: [], datesIndex: {},
      ownedGames: new Set<number>(), everPlaysPerMonth: {}, yearlyPlaysPerMonth: {} };
  }
}

/**
 * A set of plays with dates, indexed for easy retrieval of useful data.
 */
export class PlayIndex {
  private indexByPeriod: Record<number, MonthlyPlays[]> = {};
  // new games played in period
  private newIndexByPeriod: Record<number, Set<GameID>> = {};
  private playedInPeriod: Record<number, Set<GameID>> = {};
  private everPlayed = new Set<GameID>();
  // plays ever of each game - game to count
  private playsPerGame: GameTo<PlayCount> = {};
  private yearPlaysPerGame: YearTo<GamePlays> = {};
  private everNDs: Record<number, NickelDime> = {};
  private yearlyNDs: MonthTo<NickelDime> = {};

  public addPlays(pwd: MonthlyPlays) {
    if (!this.playsPerGame[pwd.game]) this.playsPerGame[pwd.game] = 0;
    if (!this.yearPlaysPerGame[pwd.year]) this.yearPlaysPerGame[pwd.year] = {};
    if (!this.yearPlaysPerGame[pwd.year][pwd.game]) this.yearPlaysPerGame[pwd.year][pwd.game] = 0;
    const before = this.playsPerGame[pwd.game];
    const after = before + pwd.quantity;
    const yearBefore = this.yearPlaysPerGame[pwd.year][pwd.game];
    const yearAfter = yearBefore + pwd.quantity;
    const y = pwd.year;
    const m = pwd.year * 100 + pwd.month;
    this.addPlayForPeriod(y, pwd);
    this.addPlayForPeriod(m, pwd);
    if (after >= 5) {
      if (!this.everNDs[pwd.year]) this.everNDs[pwd.year] = emptyNickelAndDime();
      if (!this.everNDs[m]) this.everNDs[m] = emptyNickelAndDime();
      this.updateNickelsAndDimes(pwd.game, before, after, this.everNDs[y]);
      this.updateNickelsAndDimes(pwd.game, before, after, this.everNDs[m]);
    }
    if (yearAfter >= 5) {
      if (!this.yearlyNDs[m]) this.yearlyNDs[m] = emptyNickelAndDime();
      this.updateNickelsAndDimes(pwd.game, yearBefore, yearAfter, this.yearlyNDs[m]);
    }
    this.playsPerGame[pwd.game] = after;
    this.yearPlaysPerGame[pwd.year][pwd.game] = yearAfter;
    this.everPlayed.add(pwd.game);
  }

  snapshotEverPlaysPerGame(): GamePlays {
    return {...this.playsPerGame}
  }

  snapshotYearPlaysPerGame(year: number): GamePlays {
    if (!this.yearPlaysPerGame[year]) return {};
    return { ...this.yearPlaysPerGame[year] };
  }

  private updateNickelsAndDimes(game: GameID, before: PlayCount, after: PlayCount, nd: NickelDime): void {
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

  private addPlayForPeriod(period: number, pwd: MonthlyPlays) {
    if (!this.indexByPeriod[period]) {
      this.indexByPeriod[period] = [pwd];
    } else {
      this.indexByPeriod[period].push(pwd);
    }
    if (!this.playedInPeriod[period]) this.playedInPeriod[period] = new Set<number>();
    this.playedInPeriod[period].add(pwd.game);
    if (!this.everPlayed.has(pwd.game)) {
      if (!this.newIndexByPeriod[period]) {
        this.newIndexByPeriod[period] = new Set<number>([pwd.game]);
      } else {
        this.newIndexByPeriod[period].add(pwd.game);
      }
    }
  }

  public getTotalPlays(period: number): TotalPlays {
    let total = 0;
    const gamePlays = {};
    const ids = new Set<number>();
    const plays = this.indexByPeriod[period] || [];
    for (const p of plays) {
      if (!p.expansion) total += p.quantity;
      const before = gamePlays[p.game] || 0;
      gamePlays[p.game] = before + p.quantity;
      ids.add(p.game);
    }
    const newGames = !!this.newIndexByPeriod[period] ? this.newIndexByPeriod[period] : new Set<number>();
    return { count: total, distinct: ids.size, new: newGames, played: ids, byGame: gamePlays };
  }

  public getPlays(period: number): MonthlyPlays[] {
    return this.indexByPeriod[period];
  }

  public getEverNickelAndDimes(period: number): NickelDime {
    if (!this.everNDs[period]) {
      return { nickel: new Set(), dime: new Set(), quarter: new Set(), dollar: new Set() };
    } else {
      return this.everNDs[period];
    }
  }

  public getYearlyNickelAndDimes(period: number): NickelDime {
    return this.yearlyNDs[period] || emptyNickelAndDime();
  }

  public getNewGames(period: number): Set<number> {
    return this.newIndexByPeriod[period];
  }

  public getYearKeys(): number[] {
    const result: number[] = [];
    for (const period in Object.keys(this.indexByPeriod)) {
      if (period.length === 4) {
        result.push(parseInt(period));
      }
    }
    return result;
  }

  public getMonthKeys(): number[] {
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

function makeDatesIndex(mpcs: MonthlyPlayCount[]): Record<string, number> {
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
