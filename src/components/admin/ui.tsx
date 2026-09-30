'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { CircleCheck, LoaderCircle, TriangleAlert } from 'lucide-react';
import type { ActionState } from '@/app/admin/actions';

export function SubmitButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`btn-primary ${className}`}>
      {pending && <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />}
      {pending ? 'Enregistrement…' : children}
    </button>
  );
}

/** Message de retour après enregistrement, qui s’efface tout seul quand c’est un succès */
export function FormMessage({ state }: { state: ActionState }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!state) return;
    setVisible(true);
    if (state.ok) {
      const id = window.setTimeout(() => setVisible(false), 3500);
      return () => window.clearTimeout(id);
    }
  }, [state]);
  if (!state || !visible) return null;
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={`fade-up fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-md items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl md:bottom-8 ${state.ok ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
    >
      {state.ok ? <CircleCheck size={18} aria-hidden="true" /> : <TriangleAlert size={18} aria-hidden="true" />}
      {state.message}
    </p>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ev-muted">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

export function Card({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-ev-muted/15 bg-ev-surface p-5 sm:p-6 ${className}`}>
      {title && <h2 className="mb-5 font-display text-lg">{title}</h2>}
      {children}
    </section>
  );
}

export function PageTitle({ title, intro, action }: { title: string; intro?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
        {intro && <p className="mt-1 text-ev-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
