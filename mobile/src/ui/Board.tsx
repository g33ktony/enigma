import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { A } from '@/engine/enigma';
import { LAYOUT, c, f } from './theme';

/** Tamaño de tecla/lámpara para que caben 9 por fila en el ancho de la pantalla. */
export function useKeySize() {
  const { width } = useWindowDimensions();
  const gap = 6;
  return { size: Math.min(46, Math.floor((width - 20 - 28 - gap * 8) / 9)), gap };
}

function Rows({ render }: { render: (ch: string, size: number) => ReactNode }) {
  const { size, gap } = useKeySize();
  return (
    <View style={{ gap, alignItems: 'center' }}>
      {LAYOUT.map((row) => (
        <View key={row} style={{ flexDirection: 'row', gap }}>
          {[...row].map((ch) => render(ch, size))}
        </View>
      ))}
    </View>
  );
}

export function Lampboard({ lit }: { lit: number | null }) {
  return (
    <Rows
      render={(ch, size) => {
        const on = lit != null && A[lit] === ch;
        return (
          <View
            key={ch}
            accessibilityLabel={on ? `Lámpara ${ch} encendida` : undefined}
            style={[styles.lamp, { width: size, height: size, borderRadius: size / 2 }, on && styles.lampOn]}
          >
            <Text style={[styles.lampText, { fontSize: size * 0.4 }, on && { color: '#2b1503' }]}>{ch}</Text>
          </View>
        );
      }}
    />
  );
}

export function Keyboard({ onDown, onUp, disabled }: { onDown: (ch: string) => void; onUp: () => void; disabled?: boolean }) {
  return (
    <Rows
      render={(ch, size) => (
        <Pressable
          key={ch}
          accessibilityRole="button"
          accessibilityLabel={`Tecla ${ch}`}
          disabled={disabled}
          onPressIn={() => onDown(ch)}
          onPressOut={onUp}
          style={({ pressed }) => [
            styles.key,
            { width: size, height: size, borderRadius: size / 2 },
            pressed && { transform: [{ translateY: 3 }], shadowOffset: { width: 0, height: 1 } },
          ]}
        >
          <Text style={[styles.keyText, { fontSize: size * 0.42 }]}>{ch}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  lamp: { backgroundColor: '#1d1913', borderWidth: 2, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
  lampOn: { backgroundColor: c.amber, borderColor: '#ffe2a8', shadowColor: c.amber, shadowOpacity: 0.9, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 12 },
  lampText: { fontFamily: f.monoBold, color: '#6f604a' },
  key: {
    backgroundColor: '#17181b',
    borderWidth: 3,
    borderColor: '#bfb9ab',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  keyText: { fontFamily: f.monoBold, color: c.ivory },
});
