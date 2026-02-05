export interface PlayData {
  year: number;
  month: number;
  expansion: boolean;
  quantity: number;
  bggid: number;
}
export interface CountData {
  year: number;
  month: number;
  count: number;
}
export interface GameData {
  bggid: number;
  name: string;
  yearPublished: number;
  playTime: number;
  isExpansion: boolean;
}
export interface GeekGameData {
  owned: boolean;
  game: GameData;
}
export interface MonthlyData {
  plays: PlayData[];
  counts: CountData[];
  geekGames: GeekGameData[];
}
export interface Result {
  monthly2: MonthlyData;
}

export function inflateCounts(counts: any[]): CountData[] {
  return counts.map((c: any) => {
    return {
      count: c.c,
      month: c.ym % 100,
      year: Math.floor(c.ym / 100)
    };
  })
}

export function inflateGeekGames(ggs: any[]): GeekGameData[] {
  return ggs.map((gg: any) => {
    return {
      owned: gg.o,
      game: {
        bggid: gg.game.bggid,
        name: gg.game.n,
        isExpansion: gg.game.e,
        playTime: gg.game.pt,
        yearPublished: gg.game.yp
      }
    };
  })
}

export function inflatePlays(plays: any[]): PlayData[] {
  return plays.map((p: any) => {
    return {
      bggid: p.bggid,
      expansion: p.e,
      month: p.ym % 100,
      year: Math.floor(p.ym / 100),
      quantity: p.q
    };
  })
}

// turn the squished JSON into what the code expects
export function inflate(monthly: any): MonthlyData {
  return {
    plays: inflatePlays(monthly.plays),
    counts: inflateCounts(monthly.counts),
    geekGames: inflateGeekGames(monthly.geekGames),
  }
}
