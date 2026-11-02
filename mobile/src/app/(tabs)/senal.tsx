import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { A, idx } from '@/engine/enigma';
import { useMachine } from '@/state/MachineProvider';
import { Keyboard } from '@/ui/Board';
import { Screen, Section } from '@/ui/kit';
import { SignalDiagram } from '@/ui/SignalDiagram';
import { c, f } from '@/ui/theme';

function Hop({ label, ch, back }: { label: string; ch: number; back?: boolean }) {
  return (
    <View style={styles.hop}>
      <Text style={styles.hopLabel}>{label}</Text>
      <Text style={[styles.hopCh, { borderColor: back ? c.back : c.fwd, color: back ? c.back : c.fwd }]}>{A[ch]}</Text>
    </View>
  );
}

export default function SignalScreen() {
  const [m, dispatch] = useMachine();
  const n = m.slots.length;
  const q = m.last?.seq.length === 2 * n + 4 ? m.last.seq : null;

  return (
    <Screen>
      <Section title="Recorrido de la señal" hint="Pulsa una tecla y sigue la corriente: ida en rojo, vuelta en azul. Desliza el diagrama hacia los lados">
        {q ? (
          <View style={styles.path}>
            <Hop label="tecla" ch={q[0]} />
            <Hop label="clav." ch={q[1]} />
            {m.slots.map((_, j) => {
              const i = n - 1 - j;
              return <Hop key={`f${i}`} label={m.slots[i].r} ch={q[2 + j]} />;
            })}
            <Hop label="UKW" ch={q[n + 2]} back />
            {m.slots.map((s, i) => (
              <Hop key={`b${i}`} label={s.r} ch={q[n + 3 + i]} back />
            ))}
            <Hop label="lámpara" ch={q[2 * n + 3]} back />
          </View>
        ) : (
          <Text style={styles.empty}>Todavía no has pulsado ninguna tecla.</Text>
        )}
        <SignalDiagram refl={m.refl} slots={m.slots} pairs={m.pairs} seq={q} />
        <View style={styles.legend}>
          <Text style={[styles.leg, { color: c.fwd }]}>━ Ida</Text>
          <Text style={[styles.leg, { color: c.back }]}>━ Vuelta</Text>
          <Text style={[styles.leg, { color: '#8a8d95' }]}>━ Cableado en esta posición</Text>
        </View>
      </Section>
      <Section title="Teclado">
        <Keyboard
          onDown={(ch) => {
            dispatch({ type: 'press', c: idx(ch) });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          onUp={() => {}}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  path: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  hop: { alignItems: 'center', gap: 2 },
  hopLabel: { fontFamily: f.mono, fontSize: 9, color: c.muted },
  hopCh: { fontFamily: f.monoBold, fontSize: 14, borderWidth: 1, borderRadius: 4, width: 26, height: 26, textAlign: 'center', lineHeight: 24 },
  empty: { fontFamily: f.body, fontSize: 14, color: c.muted },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  leg: { fontFamily: f.body, fontSize: 12 },
});
