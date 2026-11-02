import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { groups } from '@/engine/text';
import { c, f } from './theme';
import { Label } from './kit';

/** Tira de papel con el texto en grupos de 5 y un botón para copiarlo. */
export function Tape({ label, text, lit, placeholder }: { label: string; text: string; lit?: boolean; placeholder?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await Clipboard.setStringAsync(groups(text));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <View style={{ gap: 6 }}>
      <View style={styles.head}>
        <Label>{label}</Label>
        <Pressable accessibilityRole="button" disabled={!text} onPress={copy} hitSlop={8}>
          <Text style={[styles.copy, !text && { opacity: 0.4 }]}>{copied ? 'Copiado' : 'Copiar'}</Text>
        </Pressable>
      </View>
      <Text selectable style={[styles.tape, lit && { backgroundColor: '#f5d48d' }, !text && { color: '#1d140b66' }]}>
        {text ? groups(text) : placeholder ?? ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  copy: { fontFamily: f.bodyBold, fontSize: 13, color: c.brass },
  tape: {
    fontFamily: f.mono,
    fontSize: 15,
    letterSpacing: 1,
    lineHeight: 22,
    color: '#1d140b',
    backgroundColor: c.ivory,
    borderRadius: 4,
    padding: 10,
    minHeight: 44,
    overflow: 'hidden',
  },
});
