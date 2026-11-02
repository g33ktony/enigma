// Mismo motor que la versión web (index.html, bloque /*ENGINE*/), en TypeScript y sin mutar el estado.
export const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const ROTORS: Record<string, { w: string; n: string }> = {
  I: { w: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', n: 'Q' },
  II: { w: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', n: 'E' },
  III: { w: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', n: 'V' },
  IV: { w: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', n: 'J' },
  V: { w: 'VZBRGITYUPSDNHLXAWMJQOFECK', n: 'Z' },
  VI: { w: 'JPGVOUMFYQBENHZRDKASXLICTW', n: 'ZM' },
  VII: { w: 'NZJHGRCXMYSWBOUFAIVLPEKQDT', n: 'ZM' },
  VIII: { w: 'FKQHTLXOCBJSPDZRAMEWNIUYGV', n: 'ZM' },
  Beta: { w: 'LEYJVCNIXWPBQMDRTAKZGFUHOS', n: '' },
  Gamma: { w: 'FSOKANUERHMBTIQJXPGVZYLWDC', n: '' },
};

export const REFLECTORS: Record<string, string> = {
  A: 'EJMZALYXVBWFCRQUONTSPIKHGD',
  B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
  'B fino': 'ENKQAUYWJICOPBLMDXZVFTHRGS',
  'C fino': 'RDOBJNTKVEHMLFCWZAXGYIPSUQ',
};

export type ModelId = 'I' | 'M3' | 'M4';
export const MODELS: Record<ModelId, { name: string; rotors: string[]; refl: string[]; greek: boolean }> = {
  I: { name: 'Enigma I', rotors: ['I', 'II', 'III', 'IV', 'V'], refl: ['A', 'B', 'C'], greek: false },
  M3: { name: 'Enigma M3', rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], refl: ['B', 'C'], greek: false },
  M4: { name: 'Enigma M4', rotors: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'], refl: ['B fino', 'C fino'], greek: true },
};
export const GREEK = ['Beta', 'Gamma'];

/** Un rotor colocado: tipo, anillo (Ringstellung) y posición visible en la ventanilla, ambos 0–25. */
export type Slot = { r: string; ring: number; pos: number };
export type Pair = [number, number];

export const idx = (ch: string) => ch.charCodeAt(0) - 65;
export const mod = (n: number) => ((n % 26) + 26) % 26;

const wiring = Object.fromEntries(
  Object.entries(ROTORS).map(([k, { w }]) => {
    const fw = [...w].map(idx);
    const inv: number[] = [];
    fw.forEach((o, i) => (inv[o] = i));
    return [k, { fw, inv }];
  }),
);
const reflWiring = Object.fromEntries(Object.entries(REFLECTORS).map(([k, w]) => [k, [...w].map(idx)]));

export function through(s: Slot, c: number, back: boolean) {
  const sh = s.pos - s.ring;
  const w = wiring[s.r];
  return mod((back ? w.inv : w.fw)[mod(c + sh)] - sh);
}

export const reflect = (refl: string, c: number) => reflWiring[refl][c];
export const notches = (r: string) => ROTORS[r].n;
const atNotch = (s: Slot) => ROTORS[s.r].n.includes(A[s.pos]);

/** Avance de los rotores antes de cada letra, con el doble paso del rotor central. El griego de la M4 nunca gira. */
export function step(slots: Slot[]): Slot[] {
  const next = slots.map((s) => ({ ...s }));
  const n = next.length;
  const [l, m, r] = [next[n - 3], next[n - 2], next[n - 1]];
  if (atNotch(m)) {
    m.pos = mod(m.pos + 1);
    l.pos = mod(l.pos + 1);
  } else if (atNotch(r)) m.pos = mod(m.pos + 1);
  r.pos = mod(r.pos + 1);
  return next;
}

export function plugMap(pairs: Pair[]) {
  const p = [...Array(26).keys()];
  for (const [a, b] of pairs) {
    p[a] = b;
    p[b] = a;
  }
  return p;
}

/**
 * Cifra una letra. Devuelve la letra resultante, los rotores ya avanzados y `seq`: el contacto por el que pasa
 * la corriente en cada frontera (tecla, clavijero, cada rotor de ida, reflector, cada rotor de vuelta, lámpara).
 */
export function encipher(refl: string, slots: Slot[], plugs: number[], c: number) {
  const moved = step(slots);
  const seq = [c];
  let x = plugs[c];
  seq.push(x);
  for (let i = moved.length - 1; i >= 0; i--) seq.push((x = through(moved[i], x, false)));
  seq.push((x = reflect(refl, x)));
  for (let i = 0; i < moved.length; i++) seq.push((x = through(moved[i], x, true)));
  seq.push((x = plugs[x]));
  return { out: x, seq, slots: moved };
}
