import Image from 'next/image';
import { BadgeCheck, MessageSquareHeart, Star } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import type { Review } from '@/types';

/** Bloc 7 : avis réels publiés depuis l’admin ; sinon, invitation à laisser le premier */
export default function Testimonials({ reviews, lang }: { reviews: Review[]; lang: 'fr' | 'en' }) {
  const fr = lang === 'fr';
  return (
    <Section title={fr ? 'Ils ont commandé' : 'From our customers'}>
      {reviews.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-ev-muted/30 p-6 sm:flex-row sm:items-center sm:p-8">
          <MessageSquareHeart size={36} aria-hidden="true" className="shrink-0 text-ev-highlight" />
          <p className="max-w-prose text-ev-muted">
            {fr
              ? 'Les premiers avis arrivent avec les premières commandes. Après votre livraison, un e-mail vous invitera à partager le vôtre.'
              : 'Reviews arrive with the first orders. After delivery, you’ll get an email inviting you to share yours.'}
          </p>
        </div>
      ) : (
        <Reveal className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {reviews.map((r) => (
            <figure key={r.id ?? r.author} className="mb-5 break-inside-avoid rounded-2xl bg-ev-surface p-6">
              <p className="flex gap-0.5 text-ev-highlight" aria-label={`${r.rating}/5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} className={i < r.rating ? 'fill-current' : 'opacity-30'} aria-hidden="true" />
                ))}
              </p>
              <blockquote className="mt-3 text-lg leading-relaxed">{r.text}</blockquote>
              {r.photo && <Image src={r.photo} alt="" width={480} height={360} className="mt-4 w-full rounded-xl object-cover" />}
              <figcaption className="mt-4 flex items-center gap-1.5 text-sm text-ev-muted">
                {r.author}
                {r.verified && (
                  <>
                    <BadgeCheck size={15} aria-hidden="true" className="text-ev-highlight" /> {fr ? 'Achat vérifié' : 'Verified buyer'}
                  </>
                )}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      )}
    </Section>
  );
}
