# Máquina Enigma

Simulador de la máquina Enigma (modelos I, M3 y M4) con rotores, anillos, reflectores y clavijero reales, diagrama del recorrido de la señal y manual de uso en español.

- **Web:** `index.html`, un único archivo sin dependencias. Publicado en https://enigma-teal-three.vercel.app
- **App de iOS y Android:** `mobile/`, hecha con Expo (React Native).

## Web

Ábrelo en el navegador. Prueba del cifrado (vectores conocidos, incluido un mensaje real de 1941):

```bash
node test.js index.html
```

## App

```bash
cd mobile
pnpm install
pnpm ios        # compila y abre en el simulador de iOS
pnpm test       # pruebas del motor y del estado
```

Cada push a `main` que toque `mobile/` lanza un build en EAS y lo sube a TestFlight (`.github/workflows/testflight.yml`). Necesita el secreto `EXPO_TOKEN` en GitHub y el `ascAppId` de App Store Connect en `mobile/eas.json`.
