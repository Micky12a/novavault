import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/auth';

/**
 * Envoi des photos depuis l’admin, directement du navigateur vers Vercel Blob
 * (pas de limite de taille côté serveur). Réservé aux administrateurs connectés.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await getAdmin())) throw new Error('Non autorisé');
        return {
          allowedContentTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/avif'],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        /* rien à faire : l’URL est enregistrée avec le produit */
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
