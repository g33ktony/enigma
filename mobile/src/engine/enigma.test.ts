import { A, MODELS, REFLECTORS, ROTORS, encipher, idx, plugMap, type Slot } from './enigma';
import { clean, parsePairs, readable } from './text';

function run(refl: string, rotors: string[], rings: number[], start: string, pairs: string, text: string) {
  let slots: Slot[] = rotors.map((r, i) => ({ r, ring: rings[i], pos: idx(start[i]) }));
  const plugs = plugMap(pairs ? (parsePairs(pairs) as { pairs: [number, number][] }).pairs : []);
  return [...text]
    .map((ch) => {
      const res = encipher(refl, slots, plugs, idx(ch));
      slots = res.slots;
      return A[res.out];
    })
    .join('');
}

test('los reflectores son involuciones sin puntos fijos y los rotores son permutaciones', () => {
  for (const w of Object.values(REFLECTORS)) [...w].forEach((ch, i) => (expect(w[idx(ch)]).toBe(A[i]), expect(idx(ch)).not.toBe(i)));
  for (const { w } of Object.values(ROTORS)) expect(new Set(w).size).toBe(26);
  for (const m of Object.values(MODELS)) for (const r of m.refl) expect(REFLECTORS[r]).toBeDefined();
});

test('vector clásico: AAAAA con I-II-III en AAA da BDZGO, también en la M4', () => {
  expect(run('B', ['I', 'II', 'III'], [0, 0, 0], 'AAA', '', 'AAAAA')).toBe('BDZGO');
  expect(run('B fino', ['Beta', 'I', 'II', 'III'], [0, 0, 0, 0], 'AAAA', '', 'AAAAA')).toBe('BDZGO');
});

test('mensaje real de 1941 (Operación Barbarroja)', () => {
  const ct = 'EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLTTDEISMDICAGYKUACTCDOMOHWX';
  expect(run('B', ['II', 'IV', 'V'], [1, 20, 11], 'BLA', 'AV BS CG DL FU HZ IN KM OW RX', ct)).toMatch(/^AUFKLXABTEILUNGXVONXKURTINOWA/);
});

test('doble paso del rotor central: ADU → ADV → AEW → BFX', () => {
  let slots: Slot[] = ['I', 'II', 'III'].map((r, i) => ({ r, ring: 0, pos: idx('ADU'[i]) }));
  const seen = [];
  for (let i = 0; i < 3; i++) {
    slots = encipher('B', slots, plugMap([]), 0).slots;
    seen.push(slots.map((s) => A[s.pos]).join(''));
  }
  expect(seen).toEqual(['ADV', 'AEW', 'BFX']);
});

test('preparar y leer texto', () => {
  expect(clean('El año pasado', true, true)).toEqual({ t: 'ELXANYOXPASADO', grouped: false });
  expect(clean('Año', true, false).t).toBe('ANO');
  expect(clean('ATAQU EXALX NORTE', true, true)).toEqual({ t: 'ATAQUEXALXNORTE', grouped: true });
  expect(readable('ELXANYOXQUE', true)).toBe('EL AÑO QUE');
  expect(parsePairs('AV AB')).toHaveProperty('err');
});
