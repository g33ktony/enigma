import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { View } from 'react-native';
import { idx } from '@/engine/enigma';
import { useMachine } from '@/state/MachineProvider';
import { Keyboard, Lampboard } from '@/ui/Board';
import { KeyLine } from '@/ui/KeyLine';
import { Btn, Row, Screen, Section } from '@/ui/kit';
import { Reflector, Rotor, rotorNames } from '@/ui/Rotor';
import { Tape } from '@/ui/Tape';

export default function MachineScreen() {
  const [m, dispatch] = useMachine();
  const [held, setHeld] = useState(false);
  const compact = m.slots.length === 4;
  const names = rotorNames(m.slots.length);

  const down = (ch: string) => {
    dispatch({ type: 'press', c: idx(ch) });
    setHeld(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Rotores, lámparas y teclado caben juntos en pantalla; la cinta queda debajo.
  return (
    <Screen tight>
      <KeyLine />
      <Row style={{ justifyContent: 'center', gap: compact ? 6 : 12, flexWrap: 'nowrap' }}>
        <Reflector refl={m.refl} compact={compact} />
        {m.slots.map((s, i) => (
          <Rotor key={i} name={names[i]} r={s.r} pos={s.pos} compact={compact} onTurn={(d) => dispatch({ type: 'turn', i, d })} />
        ))}
      </Row>
      <Section title="Lámparas">
        <Lampboard lit={held && m.last ? m.last.out : null} />
      </Section>
      <Section title="Teclado">
        <Keyboard onDown={down} onUp={() => setHeld(false)} />
      </Section>
      <View style={{ gap: 12, marginTop: 8 }}>
        <Tape label="Tecleado" text={m.tapeIn} placeholder="Lo que teclees aparece aquí" />
        <Tape label="Lámparas encendidas (resultado)" text={m.tapeOut} lit placeholder="Y aquí el resultado" />
        <Btn label="Volver a la posición inicial" onPress={() => dispatch({ type: 'resetPosition' })} />
        <Btn label="Borrar cinta" onPress={() => dispatch({ type: 'clearTape' })} />
      </View>
    </Screen>
  );
}
