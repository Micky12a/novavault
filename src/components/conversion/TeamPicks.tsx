import ProductCard from '@/components/landing/ProductCard';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import type { Product } from '@/types';

/** « Ce que l’équipe offre cette année » : preuve sociale sans avis (Nordstrom) */
export default function TeamPicks({ products }: { products: Product[] }) {
  const picks = products.filter((p) => p.teamNote);
  if (picks.length === 0) return null;
  return (
    <Section title="Ce que l’équipe NovaVault offre cette année">
      <Reveal className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {picks.map((p) => (
          <ProductCard key={p.id} product={p} note={p.teamNote} />
        ))}
      </Reveal>
    </Section>
  );
}
