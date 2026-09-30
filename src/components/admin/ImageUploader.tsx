'use client';

import { upload } from '@vercel/blob/client';
import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, LoaderCircle } from 'lucide-react';

/** Convertit l’image en WebP (1600 px max) et vise moins de 200 Ko, comme l’exige le guide */
async function toWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let quality = 0.85;
  let blob: Blob | null = null;
  do {
    blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', quality));
    quality -= 0.1;
  } while (blob && blob.size > 200 * 1024 && quality > 0.45);
  if (!blob) throw new Error('Conversion impossible');
  return blob;
}

export default function ImageUploader({
  name,
  defaultValue,
  folder,
  onChange,
}: {
  name?: string;
  defaultValue?: string;
  folder: string;
  onChange?: (url: string) => void;
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function handle(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Choisis une image (JPG, PNG, WebP).');
    setBusy(true);
    setError('');
    try {
      const webp = await toWebp(file);
      const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'image';
      const res = await upload(`${folder}/${base}.webp`, webp, { access: 'public', handleUploadUrl: '/api/admin/upload', contentType: 'image/webp' });
      setUrl(res.url);
      onChange?.(res.url);
    } catch {
      setError('L’envoi a échoué. Vérifie la connexion et le jeton Vercel Blob, puis réessaie.');
    } finally {
      setBusy(false);
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    handle(e.dataTransfer.files[0]);
  };

  return (
    <div>
      {name && <input type="hidden" name={name} value={url} />}
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${drag ? 'border-ev-primary bg-ev-primary/10' : 'border-ev-muted/30 hover:border-ev-primary/60'}`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 p-6 text-center text-sm text-ev-muted">
            <ImagePlus size={28} aria-hidden="true" />
            Glisse une photo ici ou touche pour choisir
          </span>
        )}
        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-ev-bg/70">
            <LoaderCircle className="animate-spin" aria-label="Envoi en cours" />
          </span>
        )}
      </button>
      {url && !busy && (
        <button type="button" onClick={() => input.current?.click()} className="mt-2 text-sm underline underline-offset-4">
          Changer la photo
        </button>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}
