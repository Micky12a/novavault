import Marquee from '@/components/ui/Marquee';

/** Bandeau géant qui défile entre deux sections : donne le rythme de la page */
export default function UspTicker({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="-rotate-1 border-y border-ev-muted/15 bg-ev-surface py-4 sm:py-5" aria-hidden="true">
      <Marquee speed={40}>
        {items.map((text, i) => (
          <span key={i} className="flex items-center whitespace-nowrap px-6 font-display text-2xl sm:text-4xl">
            {text}
            <svg viewBox="0 0 12 12" className="ml-12 size-4 fill-ev-highlight">
              <path d="M6 0l1.8 4.2L12 6 7.8 7.8 6 12 4.2 7.8 0 6l4.2-1.8z" />
            </svg>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
