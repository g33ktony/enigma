import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Switch, Text, TextInput, View } from 'react-native';
import { clean, readable, translateUrl } from '@/engine/text';
import { HISTORIC_TEXT } from '@/state/machine';
import { useMachine } from '@/state/MachineProvider';
import { KeyLine } from '@/ui/KeyLine';
import { Body, Btn, Chip, Label, Row, Screen, Section, styles as kit } from '@/ui/kit';
import { Tape } from '@/ui/Tape';
import { c, f } from '@/ui/theme';

const LANGS = [
  ['es', 'Español'],
  ['en', 'Inglés'],
  ['fr', 'Francés'],
  ['de', 'Alemán'],
  ['it', 'Italiano'],
  ['pt', 'Portugués'],
];

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: c.brass, false: c.edge }} thumbColor={c.ivory} accessibilityLabel={label} />
      <Body style={{ flex: 1, fontSize: 14 }}>{label}</Body>
    </View>
  );
}

export default function TextScreen() {
  const [m, dispatch] = useMachine();
  const { ejemplo } = useLocalSearchParams<{ ejemplo?: string }>();
  const [text, setText] = useState('');
  const [spaceX, setSpaceX] = useState(true);
  const [ny, setNy] = useState(true);
  const [lang, setLang] = useState('es');
  const [legible, setLegible] = useState('');
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null);

  // Cada visita desde «Mensaje real de 1941» trae un valor nuevo de `ejemplo`.
  const [handled, setHandled] = useState<string>();
  if (ejemplo && ejemplo !== handled) {
    setHandled(ejemplo);
    setText(HISTORIC_TEXT);
    setSpaceX(false);
    setMsg({ text: 'Clave de 1941 cargada. Pulsa «Pasar por la máquina» para descifrar.' });
  }

  // El mensaje legible se rehace cuando cambia la cinta; entre medias se puede corregir a mano.
  const source = `${ny}:${m.tapeOut}`;
  const [shown, setShown] = useState(source);
  if (source !== shown) {
    setShown(source);
    setLegible(readable(m.tapeOut, ny));
  }

  const run = () => {
    const { t, grouped } = clean(text, spaceX, ny);
    if (!t) return setMsg({ text: 'Escribe o pega primero algún texto con letras.', err: true });
    dispatch({ type: 'clearTape' });
    dispatch({ type: 'typeText', text: t });
    setMsg({ text: `Listo: ${t.length} letras.${grouped ? ' Venía en grupos de 5, así que sus espacios se ignoraron.' : ''}` });
  };

  return (
    <Screen>
      <KeyLine />
      <Section title="Cifrar o descifrar" hint="La misma operación hace las dos cosas: solo importa empezar con la misma clave">
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Escribe un texto en claro o pega un mensaje cifrado"
          placeholderTextColor={c.muted}
          autoCorrect={false}
          style={[kit.input, { minHeight: 110, textAlignVertical: 'top' }]}
        />
        <Toggle label="Cambiar espacios por X (no se aplica a textos en grupos de 5)" value={spaceX} onChange={setSpaceX} />
        <Toggle label="Escribir la Ñ como NY (si no, se convierte en N)" value={ny} onChange={setNy} />
        <Btn primary label="Pasar por la máquina" onPress={run} />
        <Btn label="Volver a la posición inicial" onPress={() => dispatch({ type: 'resetPosition' })} />
        {msg ? <Text style={{ fontFamily: f.body, fontSize: 13, color: msg.err ? c.err : c.ok }}>{msg.text}</Text> : null}
        <Body style={{ fontSize: 13, color: c.muted }}>
          Para descifrar algo que acabas de cifrar, pulsa antes «Volver a la posición inicial»: los rotores avanzan una posición por cada letra.
        </Body>
      </Section>

      <Section title="Resultado">
        <Tape label="Lámparas encendidas" text={m.tapeOut} lit placeholder="El resultado aparece aquí" />
        <Label>Mensaje legible (X → espacio, NY → Ñ). Puedes corregirlo</Label>
        <TextInput
          value={legible}
          onChangeText={setLegible}
          multiline
          placeholder="Aquí aparece el resultado con espacios"
          placeholderTextColor={c.muted}
          style={[kit.input, { minHeight: 80, fontFamily: f.body, fontSize: 16, textAlignVertical: 'top' }]}
        />
      </Section>

      <Section title="Traducir" hint="Abre Google Traductor con el mensaje legible; detecta solo el idioma original">
        <Row>
          {LANGS.map(([code, name]) => (
            <Chip key={code} label={name} active={lang === code} onPress={() => setLang(code)} />
          ))}
        </Row>
        <Btn primary label="Traducir en Google Traductor ↗" disabled={!legible.trim()} onPress={() => Linking.openURL(translateUrl(legible.trim(), lang))} />
        <Body style={{ fontSize: 13, color: c.muted }}>
          El texto se envía a Google. En mensajes alemanes corrige antes Q por CH, SZ por ß y abreviaturas como AUFKL (Aufklärung).
        </Body>
      </Section>
    </Screen>
  );
}
