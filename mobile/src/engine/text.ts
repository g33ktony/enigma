import { idx, type Pair } from './enigma';

export const groups = (s: string) => s.replace(/(.{5})/g, '$1 ').trim();

// Texto ya en grupos de radio de 5 letras: sus espacios son separadores, nunca palabras.
const isGrouped = (t: string) => /^[A-Z]{5}( [A-Z]{5})*( [A-Z]{1,5})?$/.test(t.replace(/\s+/g, ' '));

/** Prepara un texto para la máquina: solo A–Z, sin acentos, Ñ → NY y espacios → X si se piden. */
export function clean(txt: string, spaceX: boolean, ny: boolean) {
  const t = (ny ? txt.replace(/ñ/gi, 'NY') : txt).normalize('NFD').replace(/\p{M}/gu, '').toUpperCase().trim();
  const grouped = isGrouped(t);
  return { t: t.replace(/\s+/g, spaceX && !grouped ? 'X' : '').replace(/[^A-Z]/g, ''), grouped: grouped && spaceX };
}

/** El resultado de descifrar, para leerlo: X → espacio y, si se usa la convención, NY → Ñ. */
export function readable(s: string, ny: boolean) {
  const t = s.replace(/X+/g, ' ').trim();
  return ny ? t.replace(/NY/g, 'Ñ') : t;
}

export function parsePairs(txt: string): { pairs: Pair[] } | { err: string } {
  const toks = txt.toUpperCase().replace(/[^A-Z]+/g, ' ').trim().split(' ').filter(Boolean);
  const seen = new Set<number>();
  const pairs: Pair[] = [];
  for (const t of toks) {
    if (t.length !== 2) return { err: `"${t}" no es un par: escribe dos letras juntas, por ejemplo AV.` };
    const [a, b] = [idx(t[0]), idx(t[1])];
    if (a === b) return { err: `"${t}": una letra no puede conectarse consigo misma.` };
    for (const x of [a, b]) {
      if (seen.has(x)) return { err: `La letra ${t[a === x ? 0 : 1]} aparece en dos pares. Cada letra solo admite un cable.` };
      seen.add(x);
    }
    pairs.push([a, b]);
  }
  if (pairs.length > 13) return { err: 'Como máximo caben 13 cables.' };
  return { pairs };
}

export const translateUrl = (text: string, lang: string) =>
  `https://translate.google.com/?sl=auto&tl=${lang}&text=${encodeURIComponent(text)}&op=translate`;
