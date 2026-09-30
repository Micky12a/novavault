import type { EventConfig, Market } from '@/types';

/** Affiche toutes les landings quelle que soit la date (déploiements de recette) */
const SHOW_ALL = process.env.NEXT_PUBLIC_SHOW_ALL_EVENTS === 'true';

export type EventStatus = 'upcoming' | 'live' | 'ended';

export function getEventStatus(e: EventConfig, now = new Date()): EventStatus {
  if (SHOW_ALL) return 'live';
  if (now < new Date(e.schedule.start)) return 'upcoming';
  if (now > new Date(e.schedule.end)) return 'ended';
  return 'live';
}

/** Prochain événement en cours ou à venir du même marché */
export function getNextEvent(events: EventConfig[], market: Market, now = new Date()): EventConfig | undefined {
  return events
    .filter((e) => e.market === market && getEventStatus(e, now) !== 'ended')
    .sort((a, b) => +new Date(a.schedule.start) - +new Date(b.schedule.start))[0];
}

export function isPastOrderCutoff(e: EventConfig, now = new Date()): boolean {
  return !SHOW_ALL && !!e.features.orderCutoff && now > new Date(e.features.orderCutoff.date);
}
