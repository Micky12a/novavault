/**
 * Fait voler une copie de l’image produit jusqu’à l’icône du panier.
 * Renvoie une promesse résolue à l’arrivée (ou tout de suite si l’animation est impossible ou non souhaitée).
 */
export function flyToCart(from: HTMLElement | null): Promise<void> {
  const target = document.getElementById('cart-button');
  const img = from?.closest('[data-product-card]')?.querySelector('img');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!target || !img || reduce) return Promise.resolve();

  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const clone = img.cloneNode() as HTMLImageElement;
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${a.left}px`,
    top: `${a.top}px`,
    width: `${a.width}px`,
    height: `${a.height}px`,
    borderRadius: '16px',
    objectFit: 'cover',
    zIndex: '80',
    pointerEvents: 'none',
  });
  document.body.appendChild(clone);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = clone.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.3 - 60}px) scale(0.5)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.4 },
    ],
    { duration: 700, easing: 'cubic-bezier(0.5, 0, 0.2, 1)' },
  );
  return anim.finished.then(() => clone.remove()).catch(() => clone.remove());
}
