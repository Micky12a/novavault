import Image from 'next/image';
import AddToCartButton from '@/components/cart/AddToCartButton';
import Price from '@/components/ui/Price';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import type { Product } from '@/types';

/** Menus et looks achetables en un clic (Williams Sonoma, ASOS) */
export default function ShopTheLook({ looks, lang }: { looks: { title: string; intro: string; products: Product[] }[]; lang: 'fr' | 'en' }) {
  const fr = lang === 'fr';
  return (
    <Section title={fr ? 'Prêt à recevoir' : 'Ready-made sets'}>
      <Reveal className="grid gap-5 md:grid-cols-2">
        {looks.map((look) => (
          <article key={look.title} data-product-card className="rounded-3xl bg-ev-surface p-6">
            <h3 className="font-display text-2xl">{look.title}</h3>
            <p className="mt-1 text-ev-muted">{look.intro}</p>
            <ul className="mt-5 space-y-3">
              {look.products.map((p) => (
                <li key={p.id} className="flex items-center gap-4">
                  <Image src={p.image.src} alt={p.image.alt} width={72} height={72} className="size-18 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <Price product={p} perPerson={!!p.serves} />
                  </div>
                </li>
              ))}
            </ul>
            <AddToCartButton products={look.products} className="mt-6" label={look.products.length > 1 ? (fr ? 'Tout ajouter au panier' : 'Add all to cart') : undefined} />
          </article>
        ))}
      </Reveal>
    </Section>
  );
}
