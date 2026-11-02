import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { A, mod, notches } from '@/engine/enigma';
import { c, f } from './theme';

const STEP_PX = 18; // arrastre vertical necesario para girar una letra

export const rotorNames = (n: number) => (n === 4 ? ['Griego', 'Izq.', 'Centro', 'Der.'] : ['Izquierdo', 'Central', 'Derecho']);

/** Ventanilla de un rotor con su rueda estriada: se gira arrastrando la rueda o tocando las flechas. */
export function Rotor({ name, r, pos, onTurn, compact }: { name: string; r: string; pos: number; onTurn?: (d: number) => void; compact?: boolean }) {
  const [slide] = useState(() => new Animated.Value(0));
  const prev = useRef(pos);

  useEffect(() => {
    if (prev.current === pos) return;
    const forward = mod(pos - prev.current) <= 13;
    prev.current = pos;
    slide.setValue(forward ? 14 : -14);
    Animated.timing(slide, { toValue: 0, duration: 140, useNativeDriver: true }).start();
  }, [pos, slide]);

  // onTurn solo depende de la ranura (índice) y de dispatch, que no cambian: basta con el de la primera vez.
  const [pan] = useState(() => {
    let moved = 0;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => (moved = 0),
      onPanResponderMove: (_, g) => {
        const steps = Math.trunc(g.dy / STEP_PX) - moved;
        if (steps !== 0 && onTurn) {
          moved += steps;
          onTurn(steps);
          Haptics.selectionAsync();
        }
      },
    });
  });

  const h = compact ? 96 : 112;
  const tap = (d: number) => {
    onTurn?.(d);
    Haptics.selectionAsync();
  };
  return (
    <View style={styles.unit} accessible accessibilityLabel={`Rotor ${name} tipo ${r}, posición ${A[pos]}`}>
      <Text style={styles.ttl}>{name}</Text>
      <Text style={styles.type}>{r}</Text>
      <View style={styles.wheel}>
        <View style={[styles.window, { height: h, width: compact ? 36 : 42 }]}>
          <Animated.View style={[styles.strip, { transform: [{ translateY: slide }] }]}>
            <Text style={styles.side}>{A[mod(pos - 1)]}</Text>
            <Text style={styles.cur}>{A[pos]}</Text>
            <Text style={styles.side}>{A[mod(pos + 1)]}</Text>
          </Animated.View>
          <View pointerEvents="none" style={styles.band} />
        </View>
        {onTurn ? (
          <View {...pan.panHandlers} style={[styles.thumb, { height: h }]}>
            {Array.from({ length: Math.floor(h / 6) }, (_, i) => (
              <View key={i} style={styles.ridge} />
            ))}
          </View>
        ) : null}
      </View>
      {onTurn ? (
        <View style={styles.arrows}>
          <Pressable accessibilityLabel={`Girar ${name} hacia atrás`} hitSlop={6} onPress={() => tap(-1)} style={styles.arrow}>
            <Text style={styles.arrowText}>▲</Text>
          </Pressable>
          <Pressable accessibilityLabel={`Girar ${name} hacia delante`} hitSlop={6} onPress={() => tap(1)} style={styles.arrow}>
            <Text style={styles.arrowText}>▼</Text>
          </Pressable>
        </View>
      ) : null}
      <Text style={styles.notch}>{notches(r) ? `muesca ${[...notches(r)].join('·')}` : 'no gira'}</Text>
    </View>
  );
}

export function Reflector({ refl, compact }: { refl: string; compact?: boolean }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.ttl}>UKW</Text>
      <Text style={styles.type}>{refl.includes('fino') ? 'fino' : ' '}</Text>
      <View style={[styles.reflFace, { height: compact ? 96 : 112 }]}>
        <Text style={styles.reflLetter}>{refl[0]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  unit: { alignItems: 'center', gap: 4 },
  ttl: { fontFamily: f.bodyBold, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: c.muted },
  type: { fontFamily: f.monoBold, fontSize: 13, color: c.brass, height: 18 },
  wheel: { flexDirection: 'row', gap: 4 },
  window: {
    width: 42,
    borderRadius: 6,
    backgroundColor: c.ivory,
    borderWidth: 3,
    borderColor: '#000',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  strip: { alignItems: 'center', justifyContent: 'space-evenly', flex: 1 },
  side: { fontFamily: f.monoBold, fontSize: 15, color: c.ink, opacity: 0.4 },
  cur: { fontFamily: f.monoBold, fontSize: 26, color: c.ink },
  band: { position: 'absolute', left: 0, right: 0, top: '34%', height: '32%', borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#b0402f88' },
  thumb: { width: 18, borderRadius: 9, backgroundColor: '#151618', borderWidth: 1, borderColor: '#000', overflow: 'hidden', justifyContent: 'space-between', paddingVertical: 2 },
  ridge: { height: 3, backgroundColor: '#3a3b40', marginHorizontal: 1, borderRadius: 1 },
  arrows: { flexDirection: 'row', gap: 6 },
  arrow: { width: 30, height: 26, borderRadius: 13, borderWidth: 1, borderColor: c.edge, backgroundColor: c.well, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: c.ivory, fontSize: 10 },
  notch: { fontFamily: f.mono, fontSize: 9, color: c.muted },
  reflFace: { width: 46, borderRadius: 8, backgroundColor: '#25262a', borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
  reflLetter: { fontFamily: f.display, fontSize: 28, color: c.brass },
});
