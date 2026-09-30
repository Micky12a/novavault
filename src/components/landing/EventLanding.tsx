import type { ReactNode } from 'react';
import { getEvents, getMarketConfig, getProductsByCollection, getProductsByIds, getRatingSummary, getReviews } from '@/lib/data';
import { getEventStatus, getNextEvent, isPastOrderCutoff } from '@/lib/events';
import { t } from '@/lib/market';
import type { EventConfig, Product } from '@/types';
import EventThemeProvider from '@/components/theme/EventThemeProvider';
import { MarketProvider } from '@/components/market/MarketProvider';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import TrustBanner from '@/components/landing/TrustBanner';
import UspTicker from '@/components/landing/UspTicker';
import FeaturedOffer from '@/components/landing/FeaturedOffer';
import ProductGrid from '@/components/landing/ProductGrid';
import UspBlocks from '@/components/landing/UspBlocks';
import Testimonials from '@/components/landing/Testimonials';
import EventTeaser from '@/components/landing/EventTeaser';
import EventEnded from '@/components/landing/EventEnded';
import StickyMobileCTA from '@/components/landing/StickyMobileCTA';
import DealDrops from '@/components/conversion/DealDrops';
import GiftFinder from '@/components/conversion/GiftFinder';
import GiftFilters from '@/components/conversion/GiftFilters';
import TeamPicks from '@/components/conversion/TeamPicks';
import ShopTheLook from '@/components/conversion/ShopTheLook';
import ChallengeBlock from '@/components/conversion/ChallengeBlock';
import CartDrawer from '@/components/cart/CartDrawer';
import LeadPopup from '@/components/marketing/LeadPopup';

/**
 * Une seule landing pour les 12 routes : les 8 blocs du guide dans l’ordre imposé,
 * plus les mécaniques activées depuis l’admin.
 */
export default async function EventLanding({ config }: { config: EventConfig }) {
  const status = getEventStatus(config);
  const market = await getMarketConfig(config.market);
  const lang = market.lang;
  const f = config.features;
  const ui = t(config.market);

  const shell = (children: ReactNode) => (
    <MarketProvider market={config.market}>
      <EventThemeProvider theme={config.theme} lang={lang} event={config.event}>
        {children}
      </EventThemeProvider>
    </MarketProvider>
  );

  if (status === 'upcoming') return shell(<EventTeaser config={config} />);
  if (status === 'ended') return shell(<EventEnded config={config} next={getNextEvent(await getEvents(), config.market)} />);

  const pastCutoff = isPastOrderCutoff(config);
  const collection = await getProductsByCollection(config.collection);
  const grid = pastCutoff ? collection.filter((p) => p.digital) : collection;

  const lookIds = f.shopTheLook?.flatMap((l) => l.productIds) ?? [];
  const extraIds = [...config.featuredOffers, ...lookIds, f.heroProductId, config.cart.upsellProductId].filter((x): x is string => !!x);
  const extras = await getProductsByIds([...new Set(extraIds)]);
  const byId = new Map<string, Product>([...collection, ...extras].map((p) => [p.id, p]));
  const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);

  const featured = pick(config.featuredOffers);
  const bundleIds = featured.flatMap((p) => p.bundleOf?.map((b) => b.productId) ?? []);
  const bundleProducts = await getProductsByIds([...new Set(bundleIds)]);
  const bundleById = new Map(bundleProducts.map((p) => [p.id, p]));
  const bundleContents = Object.fromEntries(
    featured.map((p) => [p.id, (p.bundleOf ?? []).map((b) => bundleById.get(b.productId)).filter((x): x is Product => !!x)]),
  );

  const [reviews, rating] = await Promise.all([getReviews(config.collection), getRatingSummary()]);
  const countdownTarget = f.orderCutoff && !pastCutoff ? f.orderCutoff.date : config.schedule.end;
  const countdownLabel = f.orderCutoff && !pastCutoff ? ui.orderWithin : ui.endsIn;

  return shell(
    <>
      {/* 1. Barre d’annonce + navigation */}
      <TopBar
        message={config.announcement.message}
        extras={market.guarantees}
        countdown={config.announcement.countdown ? { target: countdownTarget, label: countdownLabel } : undefined}
        homeHref={`/${config.slug}`}
      />

      <main>
        {/* 2. Hero */}
        <Hero
          {...config.hero}
          config={config}
          star={f.heroProductId ? byId.get(f.heroProductId) : undefined}
          countdown={{ target: countdownTarget, label: countdownLabel }}
          orderCutoff={pastCutoff ? undefined : f.orderCutoff}
        />

        {/* 3. Preuve sociale */}
        <TrustBanner rating={rating} guarantees={market.guarantees} lang={lang} />

        {f.dealDrops && <DealDrops drops={f.dealDrops} />}

        {/* 4. Offre vedette */}
        <FeaturedOffer
          products={featured}
          bundleContents={bundleContents}
          lang={lang}
          perPersonPricing={f.perPersonPricing}
          bonuses={f.bonuses}
          priceGuarantee={f.priceGuarantee ? market.priceGuaranteeText : undefined}
          endDate={config.schedule.end}
        />

        <UspTicker items={market.usps.map((u) => u.title)} />

        {f.giftFinder && <GiftFinder products={collection} budgets={f.giftFilters?.budgets} />}
        {f.giftFilters && <GiftFilters products={collection} {...f.giftFilters} />}

        {/* 5. Grille produits */}
        <ProductGrid
          products={grid}
          lang={lang}
          stockClaimed={f.stockClaimed}
          sellingFastBadge={f.sellingFastBadge}
          waitlist={f.waitlist}
          perPerson={f.perPersonPricing}
          eGiftCard={f.eGiftCard && pastCutoff}
        />

        {f.shopTheLook && <ShopTheLook looks={f.shopTheLook.map((l) => ({ title: l.title, intro: l.intro, products: pick(l.productIds) }))} lang={lang} />}
        {f.teamPicks && <TeamPicks products={collection} />}
        {f.challenge && <ChallengeBlock {...f.challenge} />}

        {/* 6. USPs */}
        <UspBlocks items={market.usps} />

        {/* 7. Avis clients */}
        <Testimonials reviews={reviews} lang={lang} />
      </main>

      {/* 8. Footer */}
      <Footer faq={market.faq} legalLinks={market.legalLinks} paymentMethods={[...market.paymentMethods, ...market.bnpl]} lang={lang} />

      {featured[0] && <StickyMobileCTA product={featured[0]} />}
      <CartDrawer
        upsell={config.cart.upsellProductId ? byId.get(config.cart.upsellProductId) : undefined}
        freeShippingThreshold={config.cart.freeShippingThreshold ?? market.freeShippingThreshold}
        bnpl={market.bnpl}
        giftTeaser={f.giftTeaser}
      />
      <LeadPopup {...config.leadCapture} />
    </>,
  );
}
