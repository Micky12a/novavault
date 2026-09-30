import { Anton, Bodoni_Moda, Bungee, Inter, Lora, Playfair_Display, Space_Grotesk } from 'next/font/google';
import type { FontKey } from '@/types';

// next/font exige des options littérales (pas de spread).
// preload: false sur les polices display pour ne pas précharger les 7 polices sur chaque page.
const bungee = Bungee({ subsets: ['latin'], weight: '400', display: 'swap', preload: false });
const anton = Anton({ subsets: ['latin'], weight: '400', display: 'swap', preload: false });
const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', preload: false });
const lora = Lora({ subsets: ['latin'], display: 'swap', preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', preload: false });
const bodoni = Bodoni_Moda({ subsets: ['latin'], display: 'swap', preload: false });
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const FONTS: Record<FontKey, { style: { fontFamily: string } }> = {
  bungee,
  anton,
  playfair,
  lora,
  spaceGrotesk,
  bodoni,
  inter,
};
