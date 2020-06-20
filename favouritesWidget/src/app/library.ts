export function toDateString(date: number): string {
  if (!date) return "";
  const y = Math.floor(date / 10000)
  const m = Math.floor(date / 100) % 100
  const d = date % 100
  const mm = (m < 10) ? "0" + m.toString() : m.toString()
  const dd = (d < 10) ? "0" + d.toString() : d.toString()
  return y.toString() + "-" + mm + "-" + dd
}

export function intToDate(date: number): Date | undefined {
  if (!date) return undefined
  const y = Math.floor(date / 10000)
  const m = Math.floor(date / 100) % 100
  const d = date % 100
  return new Date(y, m, d)
}

// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
export function daysBetween(date1: Date, date2: Date): number {
  const ONE_DAY = 1000 * 60 * 60 * 24
  const date1Ms = date1.getTime()
  const date2Ms = date2.getTime()
  const difference_ms = Math.abs(date1Ms - date2Ms)
  return Math.round(difference_ms / ONE_DAY)
}

export const star = "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z";

export const BGG_DOMAINS = ["Abstract Games", "Children's Games", "Customizable Games", "Family Games", "Party Games",
  "Strategy Games", "Thematic Games", "Unknown", "Wargames"];
