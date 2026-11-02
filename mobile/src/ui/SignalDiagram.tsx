import { ScrollView } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { A, plugMap, reflect, through, type Pair, type Slot } from '@/engine/enigma';
import { c } from './theme';

const W = 620;
const TOP = 46;
const ROW = 15;
const H = TOP + 26 * ROW + 14;

/**
 * Cableado completo en la posición actual y, encima, el camino de la última tecla: ida en rojo, vuelta en azul.
 * Cajas de izquierda a derecha: reflector, rotores, clavijero; a la derecha quedan teclado y lámparas.
 */
export function SignalDiagram({ refl, slots, pairs, seq }: { refl: string; slots: Slot[]; pairs: Pair[]; seq: number[] | null }) {
  const n = slots.length;
  const plugs = plugMap(pairs);
  const boxes = n + 2;
  const left = 50;
  const bw = (W - 60 - left) / boxes;
  const B = (k: number) => left + bw * (k + 1); // B(0) = reflector|rotor izq.; B(n+1) = lado del teclado
  const Y = (i: number) => TOP + i * ROW + ROW / 2;
  const curve = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} C${(x1 + x2) / 2} ${y1},${(x1 + x2) / 2} ${y2},${x2} ${y2}`;
  const arc = (x: number, y1: number, y2: number) => {
    const dx = Math.min(bw - 8, 12 + Math.abs(y2 - y1) * 0.22);
    return `M${x} ${y1} C${x - dx} ${y1},${x - dx} ${y2},${x} ${y2}`;
  };
  const names = ['UKW-' + refl.replace(' fino', 'f'), ...slots.map((s) => s.r), 'Clav.'];
  const q = seq && seq.length === 2 * n + 4 ? seq : null;

  const wires: string[] = [];
  slots.forEach((s, i) => {
    for (let ch = 0; ch < 26; ch++) wires.push(curve(B(i + 1), Y(ch), B(i), Y(through(s, ch, false))));
  });
  const plugged: string[] = [];
  for (let ch = 0; ch < 26; ch++) (plugs[ch] === ch ? wires : plugged).push(curve(B(n + 1), Y(ch), B(n), Y(plugs[ch])));
  for (let ch = 0; ch < 26; ch++) if (ch < reflect(refl, ch)) wires.push(arc(B(0), Y(ch), Y(reflect(refl, ch))));

  const fwd: string[] = [];
  const back: string[] = [];
  if (q) {
    fwd.push(curve(B(n + 1), Y(q[0]), B(n), Y(q[1])));
    for (let i = n - 1, k = 2; i >= 0; i--, k++) fwd.push(curve(B(i + 1), Y(q[k - 1]), B(i), Y(q[k])));
    for (let i = 0; i < n; i++) back.push(curve(B(i), Y(q[n + 2 + i]), B(i + 1), Y(q[n + 3 + i])));
    back.push(curve(B(n), Y(q[2 * n + 2]), B(n + 1), Y(q[2 * n + 3])));
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderRadius: 8, backgroundColor: c.well }}>
      <Svg width={W} height={H} accessibilityLabel="Diagrama del cableado y del recorrido de la señal">
        {names.map((nm, k) => {
          const x0 = left + bw * k;
          return (
            <G key={k}>
              <Rect x={x0 + 3} y={TOP - 6} width={bw - 6} height={26 * ROW + 12} rx={6} fill={k === 0 || k === boxes - 1 ? '#151619' : '#1a1b1f'} stroke="#2c2e33" />
              <SvgText x={x0 + bw / 2} y={18} fill={c.brass} fontSize={12} fontWeight="bold" textAnchor="middle">{nm}</SvgText>
              {k > 0 && k <= n ? (
                <SvgText x={x0 + bw / 2} y={34} fill={c.muted} fontSize={10} textAnchor="middle">{`ventana ${A[slots[k - 1].pos]}`}</SvgText>
              ) : null}
            </G>
          );
        })}
        {wires.map((d, i) => <Path key={`w${i}`} d={d} stroke="#3d3f45" strokeWidth={1} fill="none" />)}
        {plugged.map((d, i) => <Path key={`p${i}`} d={d} stroke="#7a5a2a" strokeWidth={1.5} fill="none" />)}
        {fwd.map((d, i) => <Path key={`f${i}`} d={d} stroke={c.fwd} strokeWidth={3} fill="none" strokeLinecap="round" />)}
        {q ? <Path d={arc(B(0), Y(q[n + 1]), Y(q[n + 2]))} stroke="#c78cff" strokeWidth={3} fill="none" /> : null}
        {back.map((d, i) => <Path key={`b${i}`} d={d} stroke={c.back} strokeWidth={3} fill="none" strokeLinecap="round" />)}
        {Array.from({ length: n + 2 }, (_, k) =>
          A.split('').map((_, ch) => <Circle key={`d${k}-${ch}`} cx={B(k)} cy={Y(ch)} r={1.8} fill="#6b6e76" />),
        )}
        {A.split('').map((L, ch) => {
          const isIn = q?.[0] === ch;
          const isOut = q?.[2 * n + 3] === ch;
          return (
            <SvgText key={`l${ch}`} x={B(n + 1) + 8} y={Y(ch) + 4} fontSize={11} fontWeight={isIn || isOut ? 'bold' : 'normal'} fill={isIn ? c.fwd : isOut ? c.back : c.muted}>
              {L + (isIn ? ' ←' : isOut ? ' →' : '')}
            </SvgText>
          );
        })}
      </Svg>
    </ScrollView>
  );
}
