import {
  BigShouldersStencilDisplay_600SemiBold,
  BigShouldersStencilDisplay_800ExtraBold,
} from '@expo-google-fonts/big-shoulders-stencil-display';
import { IBMPlexMono_400Regular, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { IBMPlexSans_400Regular, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MachineProvider } from '@/state/MachineProvider';
import { c } from '@/ui/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    BigShouldersStencilDisplay_600SemiBold,
    BigShouldersStencilDisplay_800ExtraBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_600SemiBold,
    IBMPlexSans_400Regular,
    IBMPlexSans_600SemiBold,
  });
  if (!loaded) return null;

  return (
    <MachineProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.wood } }} />
    </MachineProvider>
  );
}
