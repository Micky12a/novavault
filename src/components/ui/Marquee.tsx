import type { ReactNode } from 'react';

/** Bandeau défilant continu (contenu dupliqué pour une boucle sans à-coup) */
export default function Marquee({ children, speed = 30, className = '' }: { children: ReactNode; speed?: number; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee" style={{ ['--speed' as string]: `${speed}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
