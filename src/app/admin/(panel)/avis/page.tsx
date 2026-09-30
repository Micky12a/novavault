import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import ReviewForm from '@/components/admin/ReviewForm';
import { PageTitle } from '@/components/admin/ui';
import { deleteReview, toggleReview } from '@/app/admin/actions';
import { db } from '@/lib/db';
import type { EventConfig } from '@/types';

export const metadata = { title: 'Avis clients' };

export default async function ReviewsPage() {
  const [reviews, events] = await Promise.all([db.review.findMany({ orderBy: { createdAt: 'desc' } }), db.event.findMany()]);
  const collections = [...new Set<string>(events.map((e: { data: unknown }) => (e.data as EventConfig).collection))];

  return (
    <>
      <PageTitle title="Avis clients" intro="Uniquement des avis réels, reçus de clients (e-mail, message, formulaire). La note moyenne s’affiche à partir de 5 avis vérifiés." />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3">
          {reviews.length === 0 && <li className="rounded-3xl border border-dashed border-ev-muted/30 p-10 text-center text-ev-muted">Aucun avis pour l’instant.</li>}
          {reviews.map((r) => (
            <li key={r.id} className={`rounded-2xl border border-ev-muted/15 bg-ev-surface p-4 ${r.published ? '' : 'opacity-60'}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="flex gap-0.5 text-ev-highlight" aria-label={`${r.rating}/5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={15} className={i < r.rating ? 'fill-current' : 'opacity-30'} aria-hidden="true" />
                  ))}
                </p>
                <div className="flex gap-1">
                  <form action={toggleReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="rounded-full p-2 text-ev-muted hover:text-ev-text" aria-label={r.published ? 'Masquer' : 'Publier'}>
                      {r.published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </form>
                  <form action={deleteReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="rounded-full p-2 text-ev-muted hover:text-red-400" aria-label="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-2">{r.text}</p>
              <p className="mt-2 text-xs text-ev-muted">
                {r.author}
                {r.verified ? ', achat vérifié' : ''}
                {r.collection ? `, ${r.collection}` : ', toutes les pages'}
              </p>
            </li>
          ))}
        </ul>
        <ReviewForm collections={collections} />
      </div>
    </>
  );
}
