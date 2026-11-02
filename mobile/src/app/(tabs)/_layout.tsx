import { Tabs, type BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { c, f } from '@/ui/theme';

const LABELS: Record<string, string> = {
  index: 'Máquina',
  clave: 'Clave',
  texto: 'Texto',
  senal: 'Señal',
  manual: 'Manual',
};

/** Barra inferior como una placa de latón: la pestaña activa se enciende en ámbar. */
function PlateTabBar({ state, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, i) => {
        const active = state.index === i;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => !active && navigateToTab(route.key)}
            style={styles.tab}
          >
            <View style={[styles.dot, active && styles.dotOn]} />
            <Text style={[styles.label, active && { color: c.ivory }]}>{LABELS[route.name] ?? route.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <PlateTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="clave" />
      <Tabs.Screen name="texto" />
      <Tabs.Screen name="senal" />
      <Tabs.Screen name="manual" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#0e0f10', borderTopWidth: 1, borderColor: c.brass, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2a241b', borderWidth: 1, borderColor: '#000' },
  dotOn: { backgroundColor: c.amber, shadowColor: c.amber, shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  label: { fontFamily: f.bodyBold, fontSize: 12, color: c.muted, letterSpacing: 0.4 },
});
