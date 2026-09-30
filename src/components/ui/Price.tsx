import { formatPerPerson, formatPrice, savingsPercent, t } from '@/lib/market';
import type { Product } from '@/types';

/** Prix, prix barré, % d’économie et, pour les packs, prix par personne */
export default function Price({ product, perPerson = false, size = 'md' }: { product: Product; perPerson?: boolean; size?: 'md' | 'lg' }) {
  const ui = t(product.market);
  const pct = savingsPercent(product.price, product.compareAtPrice);
  const main = size === 'lg' ? 'text-3xl' : 'text-lg';

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`${main} font-semibold`}>{formatPrice(product.price, product.market)}</span>
      {product.compareAtPrice && pct && (
        <>
          <s className="text-sm text-ev-muted">{formatPrice(product.compareAtPrice, product.market)}</s>
          <span className="rounded bg-ev-highlight px-1.5 py-0.5 text-xs font-bold text-ev-bg">{ui.youSave(pct)}</span>
        </>
      )}
      {perPerson && product.serves && (
        <span className="w-full text-sm text-ev-muted">{ui.perPerson(formatPerPerson(product.price, product.serves, product.market))}</span>
      )}
    </div>
  );
}
