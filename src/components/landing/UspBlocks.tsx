import { Gift, Headphones, RotateCcw, ShieldCheck, Truck, type LucideIcon } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const ICONS: Record<string, LucideIcon> = { Truck, RotateCcw, ShieldCheck, Headphones, Gift };

/** Bloc 6 : arguments de vente */
export default function UspBlocks({ items }: { items: { icon: string; title: string; text: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <Reveal className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" as="ul">
        {items.map((u) => {
          const Icon = ICONS[u.icon] ?? ShieldCheck;
          return (
            <li key={u.title} className="group rounded-2xl border border-ev-muted/15 p-5 transition-colors hover:border-ev-primary/60 sm:p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-ev-surface text-ev-highlight transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <Icon size={24} aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold">{u.title}</p>
              <p className="mt-1 text-sm text-ev-muted">{u.text}</p>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}
