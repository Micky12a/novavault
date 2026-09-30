'use client';

import { useActionState, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Card, Field, FormMessage, SubmitButton } from '@/components/admin/ui';
import { deleteProduct, saveProduct } from '@/app/admin/actions';

type ProductData = {
  id: string;
  market: string;
  collection: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  imageAlt: string;
  serves: number | null;
  stockAllocated: number | null;
  stockSold: number | null;
  recipients: string[];
  interests: string[];
  digital: boolean;
  teamNote: string | null;
  bundleOf: { productId: string; qty: number }[];
  active: boolean;
  sortOrder: number;
};

const euros = (cents: number | null | undefined) => (cents == null ? '' : (cents / 100).toFixed(2).replace('.', ','));
const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

export default function ProductForm({
  product,
  allProducts,
  collections,
  justCreated,
}: {
  product: ProductData | null;
  allProducts: { id: string; name: string; market: string }[];
  collections: { id: string; market: string; label: string }[];
  justCreated?: boolean;
}) {
  const isNew = !product;
  const [state, action] = useActionState(saveProduct, justCreated ? { ok: true, message: 'Produit créé. Il est en ligne.' } : null);
  const [name, setName] = useState(product?.name ?? '');
  const [id, setId] = useState(product?.id ?? '');
  const [idTouched, setIdTouched] = useState(false);
  const [collection, setCollection] = useState(product?.collection ?? collections[0]?.id ?? '');
  const market = collections.find((c) => c.id === collection)?.market ?? product?.market ?? 'fr';
  const currency = market === 'us' ? '$' : '€';
  const [bundle, setBundle] = useState(product?.bundleOf ?? []);
  const sameMarket = allProducts.filter((p) => p.market === market);

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <input type="hidden" name="isNew" value={isNew ? '1' : '0'} />
      <input type="hidden" name="market" value={market} />
      <input type="hidden" name="bundleOf" value={JSON.stringify(bundle)} />

      <div className="space-y-5">
        <Card title="L’essentiel">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Nom du produit">
                <input
                  name="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (isNew && !idTouched) setId(slugify(e.target.value));
                  }}
                  className="field w-full"
                />
              </Field>
            </div>
            <Field label="Collection" hint="La page où le produit apparaît">
              <select name="collection" value={collection} onChange={(e) => setCollection(e.target.value)} className="field w-full">
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Identifiant" hint={isNew ? 'Créé à partir du nom, modifiable' : 'Ne change plus après la création'}>
              <input
                name="id"
                required
                value={id}
                readOnly={!isNew}
                onChange={(e) => {
                  setIdTouched(true);
                  setId(slugify(e.target.value));
                }}
                className="field w-full read-only:opacity-60"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description" hint="Une ou deux phrases sur le bénéfice pour le client">
                <textarea name="description" rows={3} defaultValue={product?.description ?? ''} className="field-area" />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Prix">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={`Prix de vente (${currency})`}>
              <input name="price" required inputMode="decimal" placeholder="39,90" defaultValue={euros(product?.price)} className="field w-full" />
            </Field>
            <Field label={`Prix barré (${currency})`} hint="Prix réellement pratiqué avant l’offre">
              <input name="compareAtPrice" inputMode="decimal" placeholder="Vide si pas de promo" defaultValue={euros(product?.compareAtPrice)} className="field w-full" />
            </Field>
            <Field label="Nombre de convives" hint="Pour afficher le prix par personne">
              <input name="serves" inputMode="numeric" defaultValue={product?.serves ?? ''} className="field w-full" />
            </Field>
          </div>
        </Card>

        <Card title="Pack">
          <p className="-mt-2 mb-4 text-sm text-ev-muted">Si ce produit est un pack, indique ce qu’il contient. La liste s’affiche sur la page.</p>
          <ul className="space-y-2">
            {bundle.map((b, i) => (
              <li key={i} className="flex gap-2">
                <select
                  value={b.productId}
                  onChange={(e) => setBundle(bundle.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)))}
                  className="field min-w-0 flex-1"
                >
                  <option value="">Choisir un produit</option>
                  {sameMarket.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={b.qty}
                  onChange={(e) => setBundle(bundle.map((x, j) => (j === i ? { ...x, qty: Number(e.target.value) } : x)))}
                  className="field w-20"
                  aria-label="Quantité"
                />
                <button type="button" onClick={() => setBundle(bundle.filter((_, j) => j !== i))} className="rounded-full p-3 text-ev-muted hover:bg-ev-bg hover:text-red-400" aria-label="Retirer">
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setBundle([...bundle, { productId: '', qty: 1 }])} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ev-primary">
            <Plus size={16} aria-hidden="true" /> Ajouter un article au pack
          </button>
        </Card>

        <Card title="Stock et mise en avant">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stock alloué à l’offre" hint="Active la jauge « X % réclamés ». Laisse vide sans stock réel.">
              <input name="stockAllocated" inputMode="numeric" defaultValue={product?.stockAllocated ?? ''} className="field w-full" />
            </Field>
            <Field label="Déjà vendus">
              <input name="stockSold" inputMode="numeric" defaultValue={product?.stockSold ?? ''} className="field w-full" />
            </Field>
            <Field label="Pour qui (quiz cadeau)" hint="Séparés par des virgules : Pour elle, Parents…">
              <input name="recipients" defaultValue={product?.recipients.join(', ')} className="field w-full" />
            </Field>
            <Field label="Centres d’intérêt (quiz cadeau)" hint="Séparés par des virgules : Maison, Tech…">
              <input name="interests" defaultValue={product?.interests.join(', ')} className="field w-full" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Mot de l’équipe" hint="Affiché dans « Ce que l’équipe offre ». Uniquement si c’est vrai.">
                <input name="teamNote" defaultValue={product?.teamNote ?? ''} className="field w-full" />
              </Field>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Card title="Photo">
          <ImageUploader name="imageUrl" defaultValue={product?.imageUrl} folder="produits" />
          <div className="mt-4">
            <Field label="Description de la photo" hint="Pour l’accessibilité et Google">
              <input name="imageAlt" required defaultValue={product?.imageAlt ?? ''} className="field w-full" />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Visible sur le site</span>
              <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="size-5 accent-[var(--ev-primary)]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Produit digital (livré par e-mail)</span>
              <input type="checkbox" name="digital" defaultChecked={product?.digital ?? false} className="size-5 accent-[var(--ev-primary)]" />
            </label>
            <Field label="Ordre d’affichage" hint="Les plus petits nombres apparaissent en premier">
              <input name="sortOrder" inputMode="numeric" defaultValue={product?.sortOrder ?? 0} className="field w-full" />
            </Field>
          </div>
          <SubmitButton className="mt-5 w-full">{isNew ? 'Créer le produit' : 'Enregistrer'}</SubmitButton>
        </Card>

        {!isNew && (
          <button
            type="submit"
            formAction={deleteProduct}
            formNoValidate
            onClick={(e) => {
              if (!confirm('Supprimer définitivement ce produit ?')) e.preventDefault();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-400/40 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/10"
          >
            <Trash2 size={16} aria-hidden="true" /> Supprimer le produit
          </button>
        )}
      </div>

      <FormMessage state={state} />
    </form>
  );
}
