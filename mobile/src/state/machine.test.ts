import { A } from '@/engine/enigma';
import { HISTORIC, HISTORIC_TEXT, initial, reducer, type Action, type Machine } from './machine';

const apply = (m: Machine, ...as: Action[]) => as.reduce(reducer, m);

test('cifrar, volver al inicio y descifrar devuelve el texto', () => {
  const enc = apply(initial, { type: 'turn', i: 2, d: 3 }, { type: 'typeText', text: 'HOLAXMUNDO' });
  const dec = apply(enc, { type: 'resetPosition' }, { type: 'typeText', text: enc.tapeOut });
  expect(dec.tapeOut).toBe('HOLAXMUNDO');
});

test('elegir un rotor ya usado los intercambia', () => {
  const m = reducer(initial, { type: 'setRotor', i: 0, r: 'III' });
  expect(m.slots.map((s) => s.r)).toEqual(['III', 'II', 'I']);
});

test('cambiar a M4 añade el rotor griego y un reflector fino; volver a I lo quita', () => {
  const m4 = reducer(initial, { type: 'setModel', model: 'M4' });
  expect(m4.slots.map((s) => s.r)).toEqual(['Beta', 'I', 'II', 'III']);
  expect(m4.refl).toBe('B fino');
  const back = reducer(reducer(m4, { type: 'setRotor', i: 1, r: 'VIII' }), { type: 'setModel', model: 'I' });
  expect(back.slots).toHaveLength(3);
  expect(back.slots.every((s) => ['I', 'II', 'III', 'IV', 'V'].includes(s.r))).toBe(true);
  expect(new Set(back.slots.map((s) => s.r)).size).toBe(3);
});

test('la clave de 1941 descifra el mensaje histórico', () => {
  const m = apply(initial, { type: 'load', config: HISTORIC }, { type: 'typeText', text: HISTORIC_TEXT.replace(/ /g, '') });
  expect(m.tapeOut.startsWith('AUFKLXABTEILUNG')).toBe(true);
  expect(A[m.last!.out]).toBe(m.tapeOut.at(-1));
});
