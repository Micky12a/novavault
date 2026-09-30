import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCES = new Set(['teaser', 'ended', 'hub', 'lead-popup', 'waitlist', 'challenge']);

/** Inscriptions e-mail : enregistrées en base, visibles dans Admin > Inscrits. Resend s’y branchera. */
export async function POST(req: Request) {
  let body: { email?: unknown; source?: unknown; eventId?: unknown; productId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source : '';
  const eventId = typeof body.eventId === 'string' ? body.eventId.slice(0, 64) : null;
  const productId = typeof body.productId === 'string' ? body.productId.slice(0, 64) : null;
  if (!EMAIL_RE.test(email) || email.length > 254) return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  if (!SOURCES.has(source)) return NextResponse.json({ ok: false, error: 'invalid_source' }, { status: 400 });

  const exists = await db.subscriber.findFirst({ where: { email, source, productId } });
  if (!exists) await db.subscriber.create({ data: { email, source, eventId, productId } });

  return NextResponse.json({ ok: true });
}
