/**
 * Calendar math, hand-rolled on purpose: no date dependency.
 * Every key is built from LOCAL date parts — never from `toISOString().slice`,
 * which would shift tasks across days depending on the UTC offset.
 */

/** Local day key formatted as `YYYY-MM-DD`. Empty string means "no date". */
export type DayKey = string;

/** Week starts on Monday, as French calendars do. */
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const pad = (n: number) => String(n).padStart(2, "0");

export function dayKey(value: Date | string | null | undefined): DayKey {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDayKey(key: DayKey): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function todayKey(): DayKey {
  return dayKey(new Date());
}

export function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

export function addMonths(value: Date, amount: number): Date {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function monthLabel(value: Date): string {
  return value.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

/** Grid of 5–6 weeks of 7 `DayKey`s, covering the given month. */
export function monthMatrix(cursor: Date): DayKey[][] {
  const first = startOfMonth(cursor);
  const leading = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();

  const cellCount = Math.ceil((leading + daysInMonth) / 7) * 7;
  const cells: DayKey[] = [];
  for (let i = 0; i < cellCount; i++) {
    cells.push(
      dayKey(new Date(first.getFullYear(), first.getMonth(), 1 - leading + i)),
    );
  }

  const weeks: DayKey[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** Buckets items by day, dropping anything without a date. */
export function groupByDay<T>(
  items: T[],
  pick: (item: T) => DayKey,
): Map<DayKey, T[]> {
  const map = new Map<DayKey, T[]>();
  for (const item of items) {
    const key = pick(item);
    if (!key) continue;
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return map;
}
