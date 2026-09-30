'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Fait apparaître les enfants directs en cascade quand le bloc entre à l’écran */
export default function Reveal({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Array.from(el.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(Math.min(i, 8))));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={`reveal ${className}`} data-visible={visible ? '' : undefined}>
      {children}
    </Tag>
  );
}
