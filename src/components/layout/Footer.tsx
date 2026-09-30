import Link from 'next/link';
import { BRAND } from '@/config/brand';

const PAY_LABEL: Record<string, string> = {
  cb: 'CB',
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  'apple-pay': 'Apple Pay',
  'google-pay': 'Google Pay',
  paypal: 'PayPal',
  klarna: 'Klarna',
};

/** Bloc 8 : FAQ rapide, liens légaux, moyens de paiement */
export default function Footer({
  faq,
  legalLinks,
  paymentMethods,
  lang = 'fr',
}: {
  faq: { q: string; a: string }[];
  legalLinks: { label: string; href: string }[];
  paymentMethods: string[];
  lang?: 'fr' | 'en';
}) {
  const fr = lang === 'fr';
  return (
    <footer className="mt-10 bg-ev-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">{fr ? 'Questions fréquentes' : 'FAQ'}</h2>
          <div className="mt-6 divide-y divide-ev-muted/20 border-y border-ev-muted/20">
            {faq.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-ev-muted/30 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-prose text-ev-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="font-display text-lg">{fr ? 'Paiement sécurisé' : 'Secure payment'}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {paymentMethods.map((m) => (
                <li key={m} className="rounded-md border border-ev-muted/30 bg-ev-bg px-2.5 py-1 text-xs font-medium">
                  {PAY_LABEL[m] ?? m}
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label={fr ? 'Informations légales' : 'Legal'}>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline-offset-4 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="overflow-hidden border-t border-ev-muted/15">
        <p className="mx-auto max-w-7xl select-none px-4 font-display text-[18vw] leading-[0.85] tracking-tighter text-ev-text/[0.06] sm:px-6" aria-hidden="true">
          {BRAND.name}
        </p>
        <p className="px-4 pb-6 text-center text-xs text-ev-muted">
          © {new Date().getFullYear()} {BRAND.name}. getnovavault.com
        </p>
      </div>
    </footer>
  );
}
