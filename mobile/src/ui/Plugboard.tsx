import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { idx, type Pair } from '@/engine/enigma';
import { CABLES, LAYOUT, c, f } from './theme';

const LABEL = 16; // alto de la letra encima de cada enchufe

/** Clavijero QWERTZ: toca dos letras para unirlas con un cable; toca una letra con cable para quitarlo. */
export function Plugboard({ pairs, onChange, onFull }: { pairs: Pair[]; onChange: (p: Pair[]) => void; onFull: () => void }) {
  const { width } = useWindowDimensions();
  const [sel, setSel] = useState<number | null>(null);
  const gap = 6;
  const size = Math.min(40, Math.floor((width - 20 - 28 - 16 - gap * 8) / 9));
  const rowH = LABEL + size + 14;
  const gridW = size * 9 + gap * 8;
  const pad = 8;
  const W = gridW + pad * 2;
  const H = rowH * 3 + 30;

  // Centro del enchufe de cada letra, calculado con la misma rejilla que se dibuja.
  const center = (ch: number): [number, number] => {
    const L = String.fromCharCode(65 + ch);
    const r = LAYOUT.findIndex((row) => row.includes(L));
    const col = LAYOUT[r].indexOf(L);
    const x = pad + (r === 1 ? (size + gap) / 2 : 0) + col * (size + gap) + size / 2;
    return [x, 8 + r * rowH + LABEL + size * 0.35];
  };
  const owner = new Map<number, number>();
  pairs.forEach((p, k) => p.forEach((x) => owner.set(x, k)));

  const press = (ch: number) => {
    Haptics.selectionAsync();
    const k = owner.get(ch);
    if (k != null) {
      setSel(null);
      return onChange(pairs.filter((_, j) => j !== k));
    }
    if (sel == null || sel === ch) return setSel(sel === ch ? null : ch);
    setSel(null);
    if (pairs.length >= 13) return onFull();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onChange([...pairs, [sel, ch]]);
  };

  return (
    <View style={[styles.wrap, { width: W, height: H }]}>
      <View style={{ paddingTop: 8, paddingHorizontal: pad, gap: 0 }}>
        {LAYOUT.map((row, r) => (
          <View key={row} style={{ flexDirection: 'row', gap, height: rowH, marginLeft: r === 1 ? (size + gap) / 2 : 0 }}>
            {[...row].map((L) => {
              const ch = idx(L);
              const k = owner.get(ch);
              return (
                <Pressable key={L} accessibilityRole="button" accessibilityLabel={`Clavija ${L}${k != null ? ', conectada' : ''}`} onPress={() => press(ch)} style={{ width: size, alignItems: 'center' }}>
                  <Text style={[styles.lbl, k != null && { color: c.ivory }, sel === ch && { color: c.amber }]}>{L}</Text>
                  <View style={[styles.holes, { width: size * 0.85, height: size * 0.7 }, sel === ch && { borderColor: c.amber }]}>
                    <View style={[styles.hole, { width: size * 0.24, height: size * 0.24 }]} />
                    <View style={[styles.hole, { width: size * 0.24, height: size * 0.24 }]} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
        {pairs.map(([a, b], k) => {
          const [x1, y1] = center(a);
          const [x2, y2] = center(b);
          const col = CABLES[k % CABLES.length];
          const sag = 30 + Math.abs(x2 - x1) * 0.25 + Math.abs(y2 - y1) * 0.2;
          const d = `M${x1} ${y1} C${x1} ${y1 + sag},${x2} ${y2 + sag},${x2} ${y2}`;
          return [
            <Path key={`s${k}`} d={d} stroke="#000" strokeOpacity={0.55} strokeWidth={7} fill="none" strokeLinecap="round" />,
            <Path key={`c${k}`} d={d} stroke={col} strokeWidth={4} fill="none" strokeLinecap="round" />,
            ...[[x1, y1], [x2, y2]].flatMap(([x, y], j) => [
              <Rect key={`p${k}${j}`} x={x - 8} y={y - 7} width={16} height={14} rx={3} fill="#0e0e0f" stroke={col} strokeWidth={2} />,
              <Circle key={`d${k}${j}`} cx={x} cy={y} r={2.5} fill={col} />,
            ]),
          ];
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', backgroundColor: '#0f1011', borderRadius: 10, borderWidth: 1, borderColor: '#000', overflow: 'hidden' },
  lbl: { fontFamily: f.mono, fontSize: 11, color: c.muted, height: LABEL },
  holes: { backgroundColor: '#2a2b2f', borderRadius: 5, borderWidth: 1, borderColor: '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },
  hole: { borderRadius: 99, backgroundColor: '#000' },
});
