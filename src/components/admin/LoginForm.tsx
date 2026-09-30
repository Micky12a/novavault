'use client';

import { useActionState } from 'react';
import { login } from '@/app/admin/actions';
import { SubmitButton } from '@/components/admin/ui';

export default function LoginForm() {
  const [state, action] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 space-y-3">
      <label className="block">
        <span className="sr-only">E-mail</span>
        <input name="email" type="email" required autoComplete="username" placeholder="E-mail" className="field w-full" />
      </label>
      <label className="block">
        <span className="sr-only">Mot de passe</span>
        <input name="password" type="password" required autoComplete="current-password" placeholder="Mot de passe" className="field w-full" />
      </label>
      {state && !state.ok && (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      )}
      <SubmitButton className="w-full">Se connecter</SubmitButton>
    </form>
  );
}
