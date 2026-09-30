import { Trophy } from 'lucide-react';
import EmailCapture from '@/components/marketing/EmailCapture';
import Section from '@/components/ui/Section';
import { typo } from '@/lib/typo';

/**
 * Défi d’engagement (Gymshark66, Decathlon No Return Resolution).
 * Symbolique : le droit de rétractation de 14 jours reste entier, seule la récompense est en jeu.
 */
export default function ChallengeBlock({ name, days, reward }: { name: string; days: number; reward: string }) {
  return (
    <Section id="defi">
      <div className="grid gap-8 rounded-3xl bg-ev-surface p-6 sm:p-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <Trophy size={36} aria-hidden="true" className="text-ev-highlight" />
          <h2 className="display-title mt-4 font-display text-4xl leading-tight sm:text-5xl">{name}</h2>
          <p className="mt-3 text-ev-muted">{days} jours pour ancrer une nouvelle habitude. On vous envoie un rappel et une astuce chaque semaine.</p>
        </div>
        <div>
          <ol className="list-decimal space-y-3 pl-5">
            <li>{typo('Choisissez 3 habitudes : bouger, dormir, lire, boire plus d’eau… ce qui compte pour vous.')}</li>
            <li>Équipez-vous avec la sélection ci-dessus, ou avec ce que vous avez déjà.</li>
            <li>{typo(`Tenez ${days} jours et recevez votre récompense : ${reward.charAt(0).toLowerCase() + reward.slice(1)}.`)}</li>
          </ol>
          <div className="mt-6">
            <EmailCapture source="challenge" cta="Je relève le défi" successMessage="Bienvenue dans le défi ! Premier rappel demain matin." />
          </div>
          <p className="mt-3 text-xs text-ev-muted">Le défi n’enlève rien à votre droit de rétractation de 14 jours.</p>
        </div>
      </div>
    </Section>
  );
}
