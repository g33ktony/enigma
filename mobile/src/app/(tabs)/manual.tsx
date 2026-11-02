import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HISTORIC, SIMPLE } from '@/state/machine';
import { useMachine } from '@/state/MachineProvider';
import { Btn, Screen } from '@/ui/kit';
import { c, f } from '@/ui/theme';

const H = ({ children }: { children: ReactNode }) => <Text style={s.h}>{children}</Text>;
const H3 = ({ children }: { children: ReactNode }) => <Text style={s.h3}>{children}</Text>;
const P = ({ children }: { children: ReactNode }) => <Text style={s.p}>{children}</Text>;
const B = ({ children }: { children: ReactNode }) => <Text style={s.b}>{children}</Text>;
const K = ({ children }: { children: ReactNode }) => <Text style={s.k}>{children}</Text>;
const Tip = ({ children, warn }: { children: ReactNode; warn?: boolean }) => (
  <View style={[s.tip, warn && { borderColor: c.fwd, backgroundColor: '#ff5b4514' }]}>
    <Text style={s.p}>{children}</Text>
  </View>
);

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <View style={{ gap: 10 }}>
      {items.map((it, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={s.num}>{i + 1}</Text>
          <Text style={[s.p, { flex: 1 }]}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <View style={s.table}>
      {rows.map(([a, b]) => (
        <View key={a} style={s.tr}>
          <Text style={[s.td, s.tdKey]}>{a}</Text>
          <Text style={[s.td, { flex: 1 }]}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ManualScreen() {
  const [, dispatch] = useMachine();

  return (
    <Screen>
      <View style={{ gap: 12 }}>
        <H>Qué es la Enigma</H>
        <P>
          La Enigma fue la máquina de cifrado que Alemania usó en la Segunda Guerra Mundial. Pulsas una letra y se enciende otra distinta: esa es la letra cifrada.
          Después de cada pulsación los rotores giran, así que la misma letra casi nunca se cifra igual dos veces.
        </P>
        <P>
          La máquina es <B>recíproca</B>: con la misma configuración, cifrar y descifrar es la misma operación. Si <K>HOLA</K> da <K>IIBG</K>, volviendo a la
          posición inicial y tecleando <K>IIBG</K> sale <K>HOLA</K>. No hay modo «descifrar»: basta con que las dos máquinas empiecen igual.
        </P>
        <P>Esta app reproduce el cableado real de todos los rotores y reflectores, el giro con «doble paso» y el clavijero, así que sus mensajes coinciden con una Enigma real.</P>

        <H>Partes de la máquina</H>
        <H3>Teclado y lámparas</H3>
        <P>26 teclas en orden alemán QWERTZ, sin números ni signos. Al pulsar una tecla se ilumina la letra resultante mientras la mantienes pulsada.</P>
        <H3>Rotores (Walzen)</H3>
        <P>Discos con 26 contactos por cara cableados de forma desordenada. Cada uno tiene tres ajustes:</P>
        <Steps
          items={[
            <><B>Tipo</B> (I, II, III…): cada uno tiene un cableado distinto. Cuáles usar y en qué orden se llama <B>Walzenlage</B>.</>,
            <><B>Anillo</B> (Ringstellung): desplaza el cableado respecto a las letras. Se fija antes de empezar.</>,
            <><B>Posición</B> (Grundstellung): la letra que se ve en la ventanilla. Es lo que giras con la rueda.</>,
          ]}
        />
        <P>
          El rotor derecho avanza en cada pulsación. Cuando pasa por su <B>muesca</B> arrastra al del medio, y el del medio al izquierdo. La muesca de cada rotor aparece
          debajo de él.
        </P>
        <H3>Reflector (UKW)</H3>
        <P>Devuelve la corriente por otro camino a través de los rotores. Por él la máquina es recíproca y <B>ninguna letra puede cifrarse como sí misma</B>, un fallo que ayudó a romper el cifrado.</P>
        <H3>Clavijero (Steckerbrett)</H3>
        <P>Un cable une dos letras y las intercambia antes y después de los rotores. Se usaban normalmente 10 cables; caben 13 como máximo.</P>
        <H3>Recorrido de la corriente</H3>
        <P>
          Tecla → clavijero → rotor derecho → central → izquierdo (→ griego en la M4) → reflector → de vuelta por los rotores → clavijero → lámpara. La pestaña{' '}
          <B>Señal</B> lo dibuja para cada tecla.
        </P>

        <H>Modelos y rotores</H>
        <Table
          rows={[
            ['Enigma I', 'Ejército y Luftwaffe. 3 rotores de I–V. Reflectores A, B, C.'],
            ['Enigma M3', 'Kriegsmarine. 3 rotores de I–VIII. Reflectores B, C.'],
            ['Enigma M4', 'Submarinos. 3 de I–VIII + Beta o Gamma. Reflectores B y C finos.'],
          ]}
        />
        <Table
          rows={[
            ['I', 'muesca Q → R'],
            ['II', 'muesca E → F'],
            ['III', 'muesca V → W'],
            ['IV', 'muesca J → K'],
            ['V', 'muesca Z → A'],
            ['VI–VIII', 'dos muescas: Z → A y M → N'],
            ['Beta, Gamma', 'no giran nunca (solo M4)'],
          ]}
        />

        <H>Configurarla paso a paso</H>
        <P>Todo está en la pestaña <B>Clave</B>. La clave del día tiene cinco partes:</P>
        <Steps
          items={[
            <><B>Modelo</B>: Enigma I, M3 o M4.</>,
            <><B>Reflector</B>: el más habitual es el B.</>,
            <><B>Rotores</B>: elige el tipo de cada ranura, de izquierda a derecha. Si eliges uno que ya está en otra ranura, se intercambian.</>,
            <><B>Anillos</B>: con − y +. Las hojas los daban como números: 01 es A, 02 es B… 26 es Z.</>,
            <><B>Clavijero</B>: toca dos letras para unirlas, o escribe los pares (<K>AV BS CG DL</K>).</>,
            <><B>Posición inicial</B>: gira cada rotor hasta la letra indicada. La app la recuerda como posición inicial.</>,
          ]}
        />
        <Tip>«Volver a la posición inicial» devuelve los rotores a la última posición que pusiste a mano y borra la cinta. Úsalo siempre antes de descifrar algo que acabas de cifrar.</Tip>
        <P>Una línea de hoja de claves, con la clave del mensaje de 1941:</P>
        <Table
          rows={[
            ['UKW', 'B'],
            ['Walzenlage', 'II IV V'],
            ['Ringstellung', '02 21 12'],
            ['Stecker', 'AV BS CG DL FU HZ IN KM OW RX'],
            ['Grundstellung', 'BLA'],
          ]}
        />

        <H>Cifrar un mensaje</H>
        <Steps
          items={[
            <>Configura la máquina o usa «Clave aleatoria» y apunta la clave: quien reciba el mensaje la necesita.</>,
            <>La Enigma solo tiene 26 letras. Escribe los números con letras, usa <K>X</K> en lugar de espacios y la Ñ como <K>NY</K>.</>,
            <>Teclea letra a letra en <B>Máquina</B>, o pega el texto en <B>Texto</B> y pulsa «Pasar por la máquina», que lo prepara solo.</>,
            <>Copia el resultado: sale en grupos de 5 letras, como se transmitía por radio.</>,
          ]}
        />

        <H>Descifrar un mensaje</H>
        <Steps
          items={[
            <>Configura la máquina <B>exactamente igual</B> que quien cifró, incluida la posición inicial.</>,
            <>Teclea o pega el texto cifrado. Los espacios entre grupos de 5 se ignoran solos.</>,
            <>Lee el <B>mensaje legible</B>: las X ya son espacios y las NY, Ñ.</>,
            <>Si está en otro idioma, elige uno y pulsa «Traducir en Google Traductor».</>,
          ]}
        />
        <Tip warn>Si los rotores no están en la posición inicial, sale texto sin sentido. Ante la duda, «Volver a la posición inicial».</Tip>

        <H>Ejemplos guiados</H>
        <P>
          <B>Tu primer cifrado.</B> Enigma I, UKW-B, rotores I II III, anillos en A, sin cables, posición AAA. Teclea <K>HOLAXMUNDO</K>: debe salir <K>IIBGT CLMRS</K>.
          Vuelve a la posición inicial, teclea <K>IIBGTCLMRS</K> y sale <K>HOLAX MUNDO</K>. Desde AAA, <K>AAAAA</K> da <K>BDZGO</K>: la prueba clásica de que un simulador está bien.
        </P>
        <Btn
          label="Cargar esta configuración"
          onPress={() => {
            dispatch({ type: 'load', config: SIMPLE });
            router.navigate('/');
          }}
        />
        <P>
          <B>Un mensaje real de 1941.</B> Mensaje del ejército alemán en el frente oriental. Al descifrarlo empieza por <K>AUFKL ABTEILUNG VON KURTINOWA</K>: «Unidad de
          reconocimiento de Kurtinowa…».
        </P>
        <Btn
          primary
          label="Cargar el mensaje de 1941"
          onPress={() => {
            dispatch({ type: 'load', config: HISTORIC });
            router.navigate({ pathname: '/texto', params: { ejemplo: String(Date.now()) } });
          }}
        />

        <H>Procedimiento histórico</H>
        <P>Desde 1940 cada mensaje llevaba su propia clave de mensaje para no empezar siempre en la misma posición:</P>
        <Steps
          items={[
            <>Con la clave del día, elige una posición cualquiera (<K>WZA</K>) y otra al azar como clave del mensaje (<K>SXT</K>).</>,
            <>Con los rotores en <K>WZA</K>, teclea <K>SXT</K>; supón que salen <K>UHL</K>.</>,
            <>Gira los rotores a <K>SXT</K> y cifra el mensaje.</>,
            <>Transmite <K>WZA UHL</K> y el texto cifrado. Quien recibe pone <K>WZA</K>, teclea <K>UHL</K>, obtiene <K>SXT</K> y descifra desde ahí.</>,
          ]}
        />

        <H>Reglas y convenciones</H>
        <Steps
          items={[
            <><B>Ninguna letra se cifra como sí misma.</B></>,
            <><B>Los rotores giran antes de cifrar.</B> Desde AAA, la primera letra se cifra en AAB.</>,
            <><B>Doble paso.</B> Con I-II-III, de ADU se pasa a ADV, AEW y BFX: el rotor central avanza dos veces seguidas.</>,
            <><B>La Ñ.</B> Ninguna Enigma la tuvo. Aquí se escribe NY; ojo con palabras que ya la llevan, como INYECCION.</>,
            <><B>Alemán militar.</B> Q en lugar de CH (AQT = ACHT, «ocho»), SZ en lugar de ß y abreviaturas como AUFKL.</>,
          ]}
        />

        <H>Si algo no cuadra</H>
        <Steps
          items={[
            <>Texto sin sentido: empezaste desde otra posición.</>,
            <>Solo las primeras letras salen bien: algún anillo es distinto.</>,
            <>Salen bien letras sueltas: algún cable del clavijero es distinto.</>,
            <>Nada coincide: revisa el orden de los rotores, el reflector y, en la M4, el rotor griego.</>,
          ]}
        />

        <H>Glosario</H>
        <Table
          rows={[
            ['Walzen', 'Rotores'],
            ['Walzenlage', 'Qué rotores y en qué orden'],
            ['Ringstellung', 'Ajuste de anillos'],
            ['Grundstellung', 'Posición inicial'],
            ['Umkehrwalze', 'Reflector (UKW)'],
            ['Steckerbrett', 'Clavijero'],
            ['Spruchschlüssel', 'Clave de mensaje'],
          ]}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  h: { fontFamily: f.display, fontSize: 28, letterSpacing: 1, color: c.brass, marginTop: 18 },
  h3: { fontFamily: f.bodyBold, fontSize: 16, color: c.ivory, marginTop: 6 },
  p: { fontFamily: f.body, fontSize: 15, lineHeight: 23, color: '#ddd3bb' },
  b: { fontFamily: f.bodyBold, color: c.ivory },
  k: { fontFamily: f.monoBold, color: c.amber },
  num: { width: 24, height: 24, borderRadius: 12, backgroundColor: c.brass, color: c.ink, textAlign: 'center', lineHeight: 24, fontFamily: f.bodyBold, fontSize: 13, overflow: 'hidden' },
  tip: { borderLeftWidth: 3, borderColor: c.amber, backgroundColor: '#ffb43c14', padding: 12, borderRadius: 6 },
  table: { borderTopWidth: 1, borderColor: c.edge },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderColor: c.edge, paddingVertical: 7, gap: 10 },
  td: { fontFamily: f.body, fontSize: 14, color: '#ddd3bb' },
  tdKey: { fontFamily: f.monoBold, color: c.brass, width: 116 },
});
