import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { A, GREEK, MODELS, type ModelId } from '@/engine/enigma';
import { parsePairs } from '@/engine/text';
import { HISTORIC, SIMPLE, randomConfig } from '@/state/machine';
import { useMachine } from '@/state/MachineProvider';
import { KeyLine } from '@/ui/KeyLine';
import { Body, Btn, Chip, Label, Row, Screen, Section, styles as kit } from '@/ui/kit';
import { Plugboard } from '@/ui/Plugboard';
import { rotorNames } from '@/ui/Rotor';
import { c, f } from '@/ui/theme';

const MODEL_INFO: Record<ModelId, string> = {
  I: 'Ejército y Luftwaffe. 3 rotores de entre I–V.',
  M3: 'Kriegsmarine. 3 rotores de entre I–VIII.',
  M4: 'Submarinos. 4.º rotor fino Beta o Gamma y reflector fino.',
};

const two = (n: number) => String(n + 1).padStart(2, '0');

/** Selector − valor + para anillo y posición inicial. */
function Stepper({ label, value, onStep }: { label: string; value: string; onStep: (d: number) => void }) {
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <Label>{label}</Label>
      <View style={styles.stepper}>
        <Pressable accessibilityLabel={`${label} anterior`} onPress={() => onStep(-1)} style={styles.stepBtn} hitSlop={4}>
          <Text style={styles.stepTxt}>−</Text>
        </Pressable>
        <Text style={styles.stepVal}>{value}</Text>
        <Pressable accessibilityLabel={`${label} siguiente`} onPress={() => onStep(1)} style={styles.stepBtn} hitSlop={4}>
          <Text style={styles.stepTxt}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function KeyScreen() {
  const [m, dispatch] = useMachine();
  const [pairsTxt, setPairsTxt] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);
  const names = rotorNames(m.slots.length);
  const pairsStr = m.pairs.map(([a, b]) => A[a] + A[b]).join(' ');

  const applyPairs = () => {
    if (pairsTxt == null) return;
    const r = parsePairs(pairsTxt);
    if ('err' in r) return setMsg({ text: r.err, err: true });
    dispatch({ type: 'setPairs', pairs: r.pairs });
    setPairsTxt(null);
    setMsg({ text: `${r.pairs.length} cables conectados.` });
  };

  return (
    <Screen>
      <KeyLine />

      <Section title="Modelo">
        <Row>
          {(Object.keys(MODELS) as ModelId[]).map((id) => (
            <Chip key={id} label={MODELS[id].name} active={m.model === id} onPress={() => dispatch({ type: 'setModel', model: id })} />
          ))}
        </Row>
        <Body style={{ fontSize: 13, color: c.muted }}>{MODEL_INFO[m.model]}</Body>
      </Section>

      <Section title="Reflector (UKW)">
        <Row>
          {MODELS[m.model].refl.map((r) => (
            <Chip key={r} label={`UKW-${r}`} active={m.refl === r} onPress={() => dispatch({ type: 'setRefl', refl: r })} />
          ))}
        </Row>
      </Section>

      <Section title="Rotores" hint="Tipo, anillo (Ringstellung) y posición inicial (Grundstellung), de izquierda a derecha">
        {m.slots.map((s, i) => {
          const options = m.slots.length === 4 && i === 0 ? GREEK : MODELS[m.model].rotors;
          return (
            <View key={i} style={styles.slot}>
              <Text style={styles.slotTitle}>{names[i]}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {options.map((r) => (
                  <Chip key={r} label={r} active={s.r === r} onPress={() => dispatch({ type: 'setRotor', i, r })} />
                ))}
              </ScrollView>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Stepper label="Anillo" value={`${A[s.ring]} · ${two(s.ring)}`} onStep={(d) => dispatch({ type: 'setRing', i, ring: s.ring + d })} />
                <Stepper label="Posición" value={`${A[s.pos]} · ${two(s.pos)}`} onStep={(d) => dispatch({ type: 'turn', i, d })} />
              </View>
            </View>
          );
        })}
      </Section>

      <Section title="Clavijero (Steckerbrett)" hint="Toca dos letras para unirlas con un cable. Toca una letra con cable para quitarlo">
        <Plugboard
          pairs={m.pairs}
          onChange={(pairs) => {
            dispatch({ type: 'setPairs', pairs });
            setMsg(null);
          }}
          onFull={() => setMsg({ text: 'Ya hay 13 cables: todas las letras están ocupadas.', err: true })}
        />
        <Label>Pares de clavijas (o escríbelos aquí)</Label>
        <TextInput
          value={pairsTxt ?? pairsStr}
          onChangeText={setPairsTxt}
          onSubmitEditing={applyPairs}
          onBlur={applyPairs}
          placeholder="Ej.: AV BS CG DL"
          placeholderTextColor={c.muted}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          style={kit.input}
        />
        {msg ? <Text style={{ fontFamily: f.body, fontSize: 13, color: msg.err ? c.err : c.ok }}>{msg.text}</Text> : null}
        <Btn label="Quitar cables" onPress={() => dispatch({ type: 'setPairs', pairs: [] })} />
      </Section>

      <Section title="Claves de ejemplo">
        <Btn label="Clave aleatoria" onPress={() => dispatch({ type: 'load', config: randomConfig(m.model) })} />
        <Btn label="Básica: I II III, todo en A, sin cables" onPress={() => dispatch({ type: 'load', config: SIMPLE })} />
        <Btn
          primary
          label="Mensaje real de 1941"
          onPress={() => {
            dispatch({ type: 'load', config: HISTORIC });
            router.navigate({ pathname: '/texto', params: { ejemplo: String(Date.now()) } });
          }}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  slot: { gap: 10, padding: 12, borderRadius: 10, backgroundColor: c.panel2, borderWidth: 1, borderColor: c.edge },
  slotTitle: { fontFamily: f.bodyBold, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: c.ivory },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.well, borderRadius: 8, borderWidth: 1, borderColor: c.edge },
  stepBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { color: c.brass, fontSize: 22, fontFamily: f.bodyBold },
  stepVal: { flex: 1, textAlign: 'center', fontFamily: f.monoBold, fontSize: 15, color: c.ivory },
});
