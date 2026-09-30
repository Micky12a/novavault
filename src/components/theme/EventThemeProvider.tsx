import type { CSSProperties, ReactNode } from 'react';
import { FONTS } from '@/config/fonts';
import type { EventTheme } from '@/types';

/** Injecte la DA de l’événement en variables CSS, la langue et l’événement (pour les traitements propres à chacun) */
export default function EventThemeProvider({
  theme,
  lang,
  event,
  children,
}: {
  theme: EventTheme;
  lang: 'fr' | 'en';
  event?: string;
  children: ReactNode;
}) {
  const c = theme.colors;
  const style = {
    '--ev-bg': c.bg,
    '--ev-surface': c.surface,
    '--ev-text': c.text,
    '--ev-muted': c.muted,
    '--ev-primary': c.primary,
    '--ev-primary-hover': c.primaryHover,
    '--ev-on-primary': c.onPrimary,
    '--ev-accent': c.accent,
    '--ev-highlight': c.highlight,
    '--ev-font-display': FONTS[theme.fonts.display].style.fontFamily,
    '--ev-font-body': FONTS[theme.fonts.body].style.fontFamily,
    colorScheme: theme.mode,
  } as CSSProperties;

  return (
    <div lang={lang} data-event={event} style={style} className="min-h-dvh bg-ev-bg font-body text-ev-text antialiased">
      {children}
    </div>
  );
}
