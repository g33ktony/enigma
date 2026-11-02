import { GREEK, MODELS, encipher, idx, mod, plugMap, type ModelId, type Pair, type Slot } from '@/engine/enigma';

export type Machine = {
  model: ModelId;
  refl: string;
  slots: Slot[];
  pairs: Pair[];
  /** Posición desde la que se empezó: la última que se puso a mano. */
  start: number[];
  tapeIn: string;
  tapeOut: string;
  last: { out: number; seq: number[] } | null;
};

export type Action =
  | { type: 'press'; c: number }
  | { type: 'typeText'; text: string }
  | { type: 'setModel'; model: ModelId }
  | { type: 'setRefl'; refl: string }
  | { type: 'setRotor'; i: number; r: string }
  | { type: 'setRing'; i: number; ring: number }
  | { type: 'turn'; i: number; d: number }
  | { type: 'setPairs'; pairs: Pair[] }
  | { type: 'resetPosition' }
  | { type: 'clearTape' }
  | { type: 'load'; config: Config };

export type Config = Pick<Machine, 'model' | 'refl' | 'slots' | 'pairs'>;

const zero = (r: string): Slot => ({ r, ring: 0, pos: 0 });

export const SIMPLE: Config = { model: 'I', refl: 'B', slots: ['I', 'II', 'III'].map(zero), pairs: [] };

export const HISTORIC: Config = {
  model: 'I',
  refl: 'B',
  slots: [
    { r: 'II', ring: 1, pos: idx('B') },
    { r: 'IV', ring: 20, pos: idx('L') },
    { r: 'V', ring: 11, pos: idx('A') },
  ],
  pairs: 'AV BS CG DL FU HZ IN KM OW RX'.split(' ').map((p) => [idx(p[0]), idx(p[1])]),
};
export const HISTORIC_TEXT =
  'EDPUD NRGYS ZRCXN UYTPO MRMBO FKTBZ REZKM LXLVE FGUEY SIOZV EQMIK UBPMM YLKLT TDEIS MDICA GYKUA CTCDO MOHWX MUUIA UBSTS LRNBZ SZWNR FXWFY SSXJZ VIJHI DISHP RKLKA YUPAD TXQSP INQMA TLPIF SVKDA SCTAC DPBOP VHJK';

export const initial: Machine = fromConfig(SIMPLE);

function fromConfig(c: Config): Machine {
  const slots = c.slots.map((s) => ({ ...s }));
  return { ...c, slots, start: slots.map((s) => s.pos), tapeIn: '', tapeOut: '', last: null };
}

/** Rotores válidos para un modelo, conservando los que ya estaban puestos cuando se puede. */
function slotsForModel(model: ModelId, prev: Slot[]): Slot[] {
  const M = MODELS[model];
  const old = prev.filter((s) => !GREEK.includes(s.r)).slice(-3);
  const used = new Set<string>();
  const three = old.map((s) => {
    const r = M.rotors.includes(s.r) && !used.has(s.r) ? s.r : M.rotors.find((x) => !used.has(x) && !old.some((o) => o.r === x))!;
    used.add(r);
    return { ...s, r };
  });
  if (!M.greek) return three;
  const greek = GREEK.includes(prev[0]?.r) ? prev[0] : zero('Beta');
  return [{ ...greek }, ...three];
}

const withSlots = (m: Machine, slots: Slot[]): Machine => ({ ...m, slots, last: null });

export function reducer(m: Machine, a: Action): Machine {
  switch (a.type) {
    case 'press': {
      const { out, seq, slots } = encipher(m.refl, m.slots, plugMap(m.pairs), a.c);
      return { ...m, slots, tapeIn: m.tapeIn + String.fromCharCode(65 + a.c), tapeOut: m.tapeOut + String.fromCharCode(65 + out), last: { out, seq } };
    }
    case 'typeText':
      return [...a.text].reduce((acc, ch) => reducer(acc, { type: 'press', c: idx(ch) }), m);
    case 'setModel': {
      const refl = MODELS[a.model].refl.includes(m.refl) ? m.refl : MODELS[a.model].greek ? 'B fino' : 'B';
      const slots = slotsForModel(a.model, m.slots);
      return { ...withSlots(m, slots), model: a.model, refl, start: slots.map((s) => s.pos) };
    }
    case 'setRefl':
      return { ...m, refl: a.refl, last: null };
    case 'setRotor': {
      // Un rotor no puede estar dos veces: si ya está en otra ranura, se intercambian.
      const slots = m.slots.map((s) => ({ ...s }));
      const other = slots.findIndex((s, j) => j !== a.i && s.r === a.r);
      if (other >= 0) slots[other].r = slots[a.i].r;
      slots[a.i].r = a.r;
      return withSlots(m, slots);
    }
    case 'setRing':
      return withSlots(m, m.slots.map((s, j) => (j === a.i ? { ...s, ring: mod(a.ring) } : s)));
    case 'turn': {
      const slots = m.slots.map((s, j) => (j === a.i ? { ...s, pos: mod(s.pos + a.d) } : s));
      return { ...withSlots(m, slots), start: slots.map((s) => s.pos) };
    }
    case 'setPairs':
      return { ...m, pairs: a.pairs, last: null };
    case 'resetPosition':
      return { ...withSlots(m, m.slots.map((s, j) => ({ ...s, pos: m.start[j] }))), tapeIn: '', tapeOut: '' };
    case 'clearTape':
      return { ...m, tapeIn: '', tapeOut: '' };
    case 'load':
      return fromConfig(a.config);
  }
}

export function randomConfig(model: ModelId): Config {
  const M = MODELS[model];
  const rnd = () => Math.floor(Math.random() * 26);
  const shuffle = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);
  const slots: Slot[] = shuffle(M.rotors).slice(0, 3).map((r) => ({ r, ring: rnd(), pos: rnd() }));
  if (M.greek) slots.unshift({ r: shuffle(GREEK)[0], ring: rnd(), pos: rnd() });
  const letters = shuffle([...Array(26).keys()]);
  const pairs: Pair[] = [];
  for (let i = 0; i < 20; i += 2) pairs.push([letters[i], letters[i + 1]]);
  return { model, refl: shuffle(M.refl)[0], slots, pairs };
}
