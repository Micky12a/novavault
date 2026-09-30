import type { CSSProperties, JSX } from 'react';
import type { EventKey } from '@/types';

/** Générateur pseudo-aléatoire déterministe : même rendu côté serveur et client */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const css = (v: Record<string, string | number>) => v as CSSProperties;

function Bats() {
  const r = seeded(31);
  return (
    <>
      <div className="amb-flicker absolute -left-1/4 top-0 h-[120%] w-[90%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--ev-primary)_45%,transparent),transparent)] blur-2xl" />
      <div className="amb-drift absolute bottom-0 left-0 h-1/3 w-[140%] bg-[radial-gradient(60%_100%_at_50%_100%,color-mix(in_srgb,var(--ev-accent)_60%,transparent),transparent)] opacity-70 blur-xl" />
      {Array.from({ length: 8 }, (_, i) => {
        const size = 18 + r() * 34;
        return (
          <svg
            key={i}
            viewBox="0 0 64 32"
            width={size}
            height={size / 2}
            className="amb-float absolute fill-black/80"
            style={css({ left: `${8 + r() * 84}%`, top: `${6 + r() * 60}%`, '--dur': `${5 + r() * 6}s`, '--delay': `${-r() * 6}s`, '--dx': `${-40 + r() * 80}px`, '--dy': `${-30 + r() * 60}px` })}
          >
            <path d="M32 14c-2-4-6-6-9-4-3-5-10-7-18-4 5 1 8 5 8 9 3-2 7-2 9 1 2-2 5-3 7-2 1 2 2 4 3 6 1-2 2-4 3-6 2-1 5 0 7 2 2-3 6-3 9-1 0-4 3-8 8-9-8-3-15-1-18 4-3-2-7 0-9 4z" />
          </svg>
        );
      })}
    </>
  );
}

function Leaves() {
  const r = seeded(7);
  const colors = ['var(--ev-primary)', 'var(--ev-highlight)', 'var(--ev-accent)'];
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={14 + r() * 18}
          height={14 + r() * 18}
          className="amb-fall absolute top-0 opacity-80"
          style={css({ left: `${r() * 100}%`, fill: colors[i % 3], '--dur': `${9 + r() * 9}s`, '--delay': `${-r() * 18}s`, '--dx': `${-60 + r() * 120}px`, '--rot': `${180 + r() * 360}deg` })}
        >
          <path d="M12 2c3 3 7 4 9 3-1 4 0 8-4 11-2 2-4 2-5 5-1-3-3-3-5-5C3 13 4 9 3 5c2 1 6 0 9-3z" />
        </svg>
      ))}
    </>
  );
}

function Stripes() {
  return (
    <>
      <div className="amb-stripes absolute inset-0 opacity-60" />
      <div className="amb-scan absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--ev-primary)_35%,transparent)] to-transparent" />
    </>
  );
}

function Grid() {
  return (
    <>
      <div className="amb-grid absolute -inset-x-1/2 bottom-0 h-1/2 opacity-60 [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="absolute right-[10%] top-[15%] h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--ev-accent)_45%,transparent)] blur-3xl" />
      <div className="absolute left-[5%] top-[40%] h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--ev-primary)_40%,transparent)] blur-3xl" />
    </>
  );
}

function Snow() {
  const r = seeded(12);
  return (
    <>
      {Array.from({ length: 44 }, (_, i) => {
        const size = 2 + r() * 5;
        return (
          <span
            key={i}
            className="amb-fall absolute top-0 rounded-full bg-white"
            style={css({ left: `${r() * 100}%`, width: size, height: size, opacity: 0.45 + r() * 0.5, '--dur': `${8 + r() * 10}s`, '--delay': `${-r() * 18}s`, '--dx': `${-30 + r() * 60}px`, '--rot': '0deg' })}
          />
        );
      })}
    </>
  );
}

function Sparkles() {
  const r = seeded(99);
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_30%,color-mix(in_srgb,var(--ev-primary)_25%,transparent),transparent)]" />
      {Array.from({ length: 30 }, (_, i) => {
        const size = 8 + r() * 18;
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className="amb-twinkle absolute"
            style={css({ left: `${r() * 100}%`, top: `${r() * 100}%`, fill: i % 3 ? 'var(--ev-primary)' : 'var(--ev-accent)', '--dur': `${2 + r() * 3}s`, '--delay': `${-r() * 4}s` })}
          >
            <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" />
          </svg>
        );
      })}
    </>
  );
}

const AMBIENCES: Record<EventKey, () => JSX.Element> = {
  halloween: Bats,
  thanksgiving: Leaves,
  'black-friday': Stripes,
  'cyber-monday': Grid,
  noel: Snow,
  'nouvel-an': Sparkles,
};

/** Couche d’ambiance animée derrière le hero ; masquée si l’utilisateur réduit les animations */
export default function EventAmbience({ event }: { event: EventKey }) {
  const Layer = AMBIENCES[event];
  return (
    <div className="ambience pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Layer />
    </div>
  );
}
