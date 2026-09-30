import ProductCard from '@/components/landing/ProductCard';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import type { Product } from '@/types';

/** Bloc 5 : grille produits avec ajout rapide, qui apparaît en cascade */
export default function ProductGrid({
  products,
  lang,
  stockClaimed,
  sellingFastBadge,
  waitlist,
  perPerson,
  eGiftCard,
}: {
  products: Product[];
  lang: 'fr' | 'en';
  stockClaimed?: boolean;
  sellingFastBadge?: boolean;
  waitlist?: boolean;
  perPerson?: boolean;
  eGiftCard?: boolean;
}) {
  const fr = lang === 'fr';
  return (
    <Section
      id="collection"
      title={fr ? 'Toute la sélection' : 'Shop the collection'}
      intro={eGiftCard ? (fr ? 'Trop tard pour la livraison ? L’e-carte cadeau arrive par e-mail en quelques minutes.' : 'Too late for delivery? Our e-gift card arrives by email in minutes.') : undefined}
    >
      {products.length === 0 ? (
        <p className="text-ev-muted">{fr ? 'La sélection arrive bientôt.' : 'The collection is coming soon.'}</p>
      ) : (
        <Reveal className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} stockClaimed={stockClaimed} sellingFastBadge={sellingFastBadge} waitlist={waitlist} perPerson={perPerson} />
          ))}
        </Reveal>
      )}
    </Section>
  );
}
