const NBSP = '\u00A0'; // espace insécable
const NNBSP = '\u202F'; // espace fine insécable

/**
 * Typographie française : espaces insécables avant : ; ! ? %, dans « », entre un nombre
 * et son unité, et vrai signe moins devant les réductions (−70 %).
 */
export function frenchTypography(s: string): string {
  return s
    .replace(/(^|[\s(])-(\d)/g, '$1\u2212$2')
    .replace(/ ([!?;%])/g, `${NNBSP}$1`)
    .replace(/ :/g, `${NBSP}:`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/(\d) (?=(€|h|min|kg|ml|mAh|W|cm|m|Ko|jours|j)(?![\p{L}\d]))/gu, `$1${NBSP}`);
}

/** Applique la typographie française à toutes les chaînes d’un objet de config */
export function withFrenchTypography<T>(value: T): T {
  if (typeof value === 'string') return frenchTypography(value) as T;
  if (Array.isArray(value)) return value.map((v) => withFrenchTypography(v)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withFrenchTypography(v)])) as T;
  }
  return value;
}

/** Raccourci pour les textes français écrits dans les composants */
export const typo = frenchTypography;
