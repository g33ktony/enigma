import { StyleSheet, Text, View } from 'react-native';
import { A, MODELS } from '@/engine/enigma';
import { useMachine } from '@/state/MachineProvider';
import { c, f } from './theme';

/** Placa con el nombre y la clave actual en una línea, como se apuntaría en la hoja de claves. */
export function KeyLine() {
  const [m] = useMachine();
  const rings = m.slots.map((s) => String(s.ring + 1).padStart(2, '0')).join(' ');
  return (
    <View style={styles.wrap}>
      <View style={styles.plate}>
        <Text style={styles.brand}>ENIGMA</Text>
        <Text style={styles.model}>{MODELS[m.model].name.toUpperCase()}</Text>
      </View>
      <Text style={styles.line}>
        UKW <Text style={styles.b}>{m.refl}</Text> · Rotores <Text style={styles.b}>{m.slots.map((s) => s.r).join(' ')}</Text> · Anillos{' '}
        <Text style={styles.b}>{rings}</Text> · Cables <Text style={styles.b}>{m.pairs.length}</Text> · Inicio{' '}
        <Text style={styles.b}>{m.start.map((p) => A[p]).join('')}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  plate: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: c.brass,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#0e0f10',
  },
  brand: { fontFamily: f.display, fontSize: 28, letterSpacing: 5, color: c.brass },
  model: { fontFamily: f.mono, fontSize: 11, letterSpacing: 1, color: c.muted },
  line: { fontFamily: f.mono, fontSize: 12, lineHeight: 18, color: c.muted },
  b: { color: c.ivory, fontFamily: f.monoBold },
});
