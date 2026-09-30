'use client';

import { useActionState, useEffect, useRef } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Card, Field, FormMessage, SubmitButton } from '@/components/admin/ui';
import { saveReview } from '@/app/admin/actions';

export default function ReviewForm({ collections }: { collections: string[] }) {
  const [state, action] = useActionState(saveReview, null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="lg:sticky lg:top-24 lg:self-start">
      <Card title="Ajouter un avis reçu">
        <div className="space-y-4">
          <Field label="Prénom et initiale du client" hint="Ex. : Sarah M.">
            <input name="author" required className="field w-full" />
          </Field>
          <Field label="Note">
            <select name="rating" defaultValue="5" className="field w-full">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} sur 5
                </option>
              ))}
            </select>
          </Field>
          <Field label="Avis, tel que le client l’a écrit">
            <textarea name="text" rows={4} required className="field-area" />
          </Field>
          <Field label="Page concernée">
            <select name="collection" className="field w-full">
              <option value="">Toutes les pages</option>
              {collections.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Photo envoyée par le client" hint="Optionnel">
            <ImageUploader name="photoUrl" folder="avis" />
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="verified" defaultChecked className="size-5 accent-[var(--ev-primary)]" />
            Le client a bien acheté le produit
          </label>
          <label className="flex items-start gap-3 rounded-2xl bg-ev-bg p-3 text-sm">
            <input type="checkbox" name="genuine" required className="mt-0.5 size-5 shrink-0 accent-[var(--ev-primary)]" />
            Je confirme qu’il s’agit d’un avis réel, reçu de ce client et reproduit sans modification.
          </label>
        </div>
        <SubmitButton className="mt-5 w-full">Publier l’avis</SubmitButton>
      </Card>
      <FormMessage state={state} />
    </form>
  );
}
