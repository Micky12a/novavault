/** Conversions entre une heure « murale » dans un fuseau (champ datetime-local) et une date ISO absolue */

function offsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUtc - date.getTime()) / 60000);
}

const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');

/** "2026-10-31T23:59" + "Europe/Paris" → "2026-10-31T23:59:00+01:00" */
export function zonedLocalToIso(local: string, timeZone: string): string {
  const [date, time = '00:00'] = local.split('T');
  const guess = new Date(`${date}T${time.length === 5 ? `${time}:00` : time}Z`);
  let offset = offsetMinutes(guess, timeZone);
  offset = offsetMinutes(new Date(guess.getTime() - offset * 60000), timeZone);
  const sign = offset >= 0 ? '+' : '-';
  return `${date}T${time.slice(0, 5)}:00${sign}${pad(Math.trunc(offset / 60))}:${pad(offset % 60)}`;
}

/** Date ISO → valeur pour un champ datetime-local, dans le fuseau du marché */
export function isoToZonedLocal(iso: string, timeZone: string): string {
  if (!iso) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}
