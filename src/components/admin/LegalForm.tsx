'use client';

import { useActionState } from 'react';
import { Card, Field, FormMessage, SubmitButton } from '@/components/admin/ui';
import { saveLegalPage } from '@/app/admin/actions';

export default function LegalForm({ slug, title, body }: { slug: string; title: string; body: string }) {
  const [state, action] = useActionState(saveLegalPage, null);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="slug" value={slug} />
      <Card>
        <div className="space-y-4">
          <Field label="Titre">
            <input name="title" defaultValue={title} className="field w-full" />
          </Field>
          <Field label="Contenu" hint="Laisse une ligne vide entre deux paragraphes. Commence une ligne par « ## » pour en faire un intertitre.">
            <textarea name="body" rows={22} defaultValue={body} className="field-area leading-relaxed" />
          </Field>
        </div>
        <SubmitButton className="mt-5">Enregistrer la page</SubmitButton>
      </Card>
      <FormMessage state={state} />
    </form>
  );
}
