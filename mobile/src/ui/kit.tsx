import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { c, f } from './theme';

/** Pantalla con el fondo de madera y el panel negro de la máquina. */
export function Screen({ children, scroll = true, tight }: { children: ReactNode; scroll?: boolean; tight?: boolean }) {
  const insets = useSafeAreaInsets();
  // El margen superior va fuera del scroll: así el contenido nunca pasa por debajo de la hora.
  const body = <View style={[styles.panel, { marginTop: 6 }, tight && { gap: 14, paddingVertical: 12 }]}>{children}</View>;
  return (
    <View style={[styles.wood, { paddingTop: insets.top }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </View>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export function Label({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Btn({ label, onPress, primary, disabled, style }: { label: string; onPress: () => void; primary?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.btn, primary && styles.btnPrimary, (pressed || disabled) && { opacity: 0.6 }, style]}
    >
      <Text style={[styles.btnText, primary && { color: c.ink }]}>{label}</Text>
    </Pressable>
  );
}

/** Opción seleccionable de un grupo (modelo, reflector, rotor, idioma). */
export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: c.ivory, borderColor: c.ivory }]}
    >
      <Text style={[styles.chipText, active && { color: c.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, style]}>{children}</View>;
}

export const styles = StyleSheet.create({
  wood: { flex: 1, backgroundColor: c.wood },
  scroll: { paddingHorizontal: 10, paddingBottom: 24 },
  panel: {
    backgroundColor: c.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    gap: 22,
  },
  sectionHead: { gap: 2 },
  sectionTitle: { fontFamily: f.displaySemi, fontSize: 17, letterSpacing: 2.5, textTransform: 'uppercase', color: c.brass },
  hint: { fontFamily: f.body, fontSize: 13, color: c.muted },
  label: { fontFamily: f.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: c.muted },
  body: { fontFamily: f.body, fontSize: 15, lineHeight: 23, color: '#ddd3bb' },
  btn: { backgroundColor: c.panel2, borderWidth: 1, borderColor: c.edge, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center' },
  btnPrimary: { backgroundColor: c.brass, borderColor: c.brass },
  btnText: { fontFamily: f.bodyBold, fontSize: 14, color: c.ivory },
  chip: { borderWidth: 1, borderColor: c.edge, backgroundColor: c.well, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 13 },
  chipText: { fontFamily: f.monoBold, fontSize: 13, color: c.ivory },
  input: {
    backgroundColor: c.well,
    borderWidth: 1,
    borderColor: c.edge,
    borderRadius: 8,
    padding: 10,
    color: c.ivory,
    fontFamily: f.mono,
    fontSize: 15,
  },
});
