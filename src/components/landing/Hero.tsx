import Image from 'next/image';
import { ArrowDown, Truck } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import EventAmbience from '@/components/effects/EventAmbience';
import FlipCountdown from '@/components/ui/FlipCountdown';
import Price from '@/components/ui/Price';
import { t } from '@/lib/market';
import type { EventConfig, Product } from '@/types';

type Props = EventConfig['hero'] & {
  config: EventConfig;
  star?: Product;
  countdown: { target: string; label: string };
  orderCutoff?: { date: string; label: string };
};

/**
 * Bloc 2 : plein écran, visuel en fond, ambiance animée propre à l’événement,
 * titre qui monte mot par mot (le seul grand mouvement de la page), compte à rebours à volets.
 */
export default function Hero({ badge, title, subtitle, cta, image, config, star, countdown, orderCutoff }: Props) {
  const fr = config.market === 'fr';
  const ui = t(config.market);
  const early = config.features.earlyAccess;
  const words = title.split(' ');

  return (
    <section className="hero relative isolate flex min-h-[calc(100svh-7.5rem)] items-end overflow-hidden md:items-center">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ev-bg via-ev-bg/80 to-ev-bg/30 md:bg-gradient-to-r md:from-ev-bg md:via-ev-bg/75 md:to-transparent" />
      <div className="-z-10">
        <EventAmbience event={config.event} />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-10 pt-24 sm:px-6 md:grid-cols-[1.25fr_1fr] md:py-20">
        <div>
          <p className="fade-up inline-flex items-center gap-2 rounded-full border border-ev-highlight/50 bg-ev-bg/60 px-3.5 py-1.5 text-sm font-medium backdrop-blur" style={{ ['--d' as string]: '0ms' }}>
            <span className="live-dot size-2 rounded-full bg-ev-highlight" aria-hidden="true" />
            {badge}
          </p>

          <h1 className="hero-title display-title mt-5 font-display text-[clamp(2.6rem,7.5vw,5.75rem)] leading-[0.95] tracking-tight">
            {words.map((w, i) => (
              <span key={i} className="hero-word">
                <span style={{ ['--i' as string]: i }}>{w}</span>
                {i < words.length - 1 && ' '}
              </span>
            ))}
          </h1>

          <p className="fade-up mt-5 max-w-xl text-lg text-ev-text/85 sm:text-xl" style={{ ['--d' as string]: `${words.length * 70 + 250}ms` }}>
            {subtitle}
          </p>

          <div className="fade-up mt-8 flex flex-wrap items-center gap-4" style={{ ['--d' as string]: `${words.length * 70 + 400}ms` }}>
            <a href={cta.href} className="btn-primary px-8 text-base">
              {cta.label}
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            {orderCutoff && (
              <p className="flex items-center gap-2 text-sm text-ev-text/85">
                <Truck size={18} aria-hidden="true" className="shrink-0 text-ev-highlight" />
                {orderCutoff.label}
              </p>
            )}
          </div>

          <div className="fade-up mt-10" style={{ ['--d' as string]: `${words.length * 70 + 550}ms` }}>
            <FlipCountdown target={early ? early.publicAt : countdown.target} label={early ? (fr ? 'Ouverture au public dans' : 'Opens to everyone in') : countdown.label} />
          </div>
        </div>

        {star && (
          <aside className="fade-up self-end md:self-center" style={{ ['--d' as string]: '700ms' }} data-product-card>
            <div className="rounded-3xl border border-ev-muted/20 bg-ev-bg/70 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
              <div className="relative overflow-hidden rounded-2xl">
                <Image src={star.image.src} alt={star.image.alt} width={640} height={640} sizes="(min-width: 768px) 30vw, 90vw" className="aspect-[4/3] w-full object-cover md:aspect-square" />
                <span className="absolute left-3 top-3 rounded-full bg-ev-highlight px-3 py-1 text-xs font-bold text-ev-bg">
                  {fr ? 'La pièce star' : 'Star pick'}
                </span>
              </div>
              <p className="mt-4 font-display text-xl leading-tight">{star.name}</p>
              {star.description && <p className="mt-1 text-sm text-ev-muted">{star.description}</p>}
              <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                <Price product={star} size="lg" />
                <AddToCartButton products={[star]} label={ui.addToCart} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
