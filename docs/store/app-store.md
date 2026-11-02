# Máquina Enigma en la App Store

Guía para publicar la versión 1.0 en iOS como **app de pago de $49 MXN**, sin compras dentro de la app ni suscripciones.
Los textos ya respetan los límites de App Store Connect (ASC).

- Bundle ID: `com.syntergy.enigma`
- Proyecto EAS: https://expo.dev/accounts/geektony/projects/enigma
- Capturas: `docs/store/iphone-6.9/*.jpg` (1320×2868, sin canal alfa). Se regeneran con `bash docs/store/make-screenshots.sh`.
- Privacidad: https://enigma-teal-three.vercel.app/privacy.html
- Soporte: https://enigma-teal-three.vercel.app/support.html

---

## Paso a paso

### 1. Revisa que puedes cobrar (una sola vez por cuenta)

En ASC → **Negocio** (Business), el **Acuerdo de apps de pago** (Paid Apps Agreement) debe estar **Activo**, con cuenta
bancaria y datos fiscales. Si ya cobras las suscripciones de ritmo, ya está hecho. Si dice "Pendiente", termínalo antes:
sin él, una app de pago no se puede publicar.

### 2. Crea la app en App Store Connect

ASC → **Apps** → **+** → **Nueva app**:

| Campo | Valor |
|---|---|
| Plataformas | iOS |
| Nombre | `Máquina Enigma` (si ya está ocupado: `Enigma: máquina de cifrado`) |
| Idioma principal | Español (México) |
| Bundle ID | `com.syntergy.enigma` (EAS ya lo registró en el primer build) |
| SKU | `enigma-ios` |
| Acceso de usuarios | Acceso completo |

Al crearla, en **Información de la app** aparece el **Apple ID** de la app (un número de 10 dígitos). Pásamelo: va en
`mobile/eas.json` (`ascAppId`, ahora dice `PENDIENTE`) para que el build se suba solo a TestFlight.

### 3. Sube el build

El primer build de producción ya se compiló en EAS. Con el `ascAppId` puesto:

```bash
cd mobile && npx eas-cli@latest submit -p ios --latest
```

A partir de ahí, cada push a `main` que toque `mobile/` compila y sube a TestFlight solo, cuando exista el secreto
`EXPO_TOKEN` en GitHub (ver §9). El build tarda 5–15 minutos en aparecer en ASC → TestFlight tras procesarse.

### 4. Precio: $49 MXN

ASC → tu app → **Precios y disponibilidad**:
1. **Precio de la app** → **Agregar precio** → país o región base: **México** → precio: **MXN 49.00**.
   Apple calcula el equivalente en los demás países y los ajusta según su tipo de cambio.
2. **Disponibilidad**: todos los países y regiones (o solo los hispanohablantes, si prefieres: la app está en español).
3. **Compras dentro de la app y suscripciones**: ninguna. No hay que crear nada más.

En México el precio ya incluye IVA, que Apple retiene. Si estás en el **App Store Small Business Program** Apple se
queda el 15 %; si no, el 30 %. Con el 15 % te llegan unos $36 MXN por venta. Conviene inscribirse si aún no lo estás:
https://developer.apple.com/app-store/small-business-program/

### 5. Información de la app

| Campo | Valor |
|---|---|
| Categoría principal | Educación |
| Categoría secundaria | Entretenimiento |
| Derechos de contenido | No contiene, muestra ni accede a contenido de terceros |
| URL de la política de privacidad | `https://enigma-teal-three.vercel.app/privacy.html` |

**Clasificación por edad**: responde **Ninguno / No** a todas las preguntas. Resultado esperado: **4+**.
(Habla de la Segunda Guerra Mundial como historia, pero no muestra violencia.)

### 6. Privacidad de la app (App Privacy)

**¿Recopilas datos de esta app?** → **No, no recopilamos datos**. Publicar. La etiqueta queda en "Datos no recopilados".

Es correcto: todo se procesa en el teléfono, no hay cuentas, analítica ni servidores. El botón de traducir abre Google
Traductor solo cuando el usuario lo pulsa, y eso no cuenta como recopilación de la app.

### 7. Ficha de la versión 1.0 (Español, México)

Sube las 5 capturas de `docs/store/iphone-6.9/` en orden en **iPhone de 6.9"** (ASC las reutiliza para los demás
tamaños de iPhone). No hace falta iPad: la app es solo para iPhone.

**Nombre** (≤30)
```
Máquina Enigma
```

**Subtítulo** (≤30)
```
Cifra y descifra como en 1941
```

**Texto promocional** (≤170; se puede cambiar sin nueva versión)
```
La máquina de cifrado más famosa de la historia, fiel a las originales: rotores, clavijero y el mensaje real de 1941 para descifrar. Un solo pago, sin suscripciones.
```

**Palabras clave** (≤100 bytes, separadas por coma, sin repetir palabras del nombre ni del subtítulo)
```
criptografia,codigo secreto,turing,bletchley,wehrmacht,rotores,mensaje oculto,historia,ww2,espia
```

**Descripción** (≤4000)
```
Máquina Enigma es un simulador fiel de la máquina de cifrado que Alemania usó en la Segunda Guerra Mundial. Pulsas una letra, giran los rotores y se enciende otra letra: igual que en la original. Los mensajes que cifres aquí se descifran en una Enigma real, y al revés.

TRES MODELOS, CONFIGURABLES COMO LOS REALES
• Enigma I (Ejército y Luftwaffe), M3 (Kriegsmarine) y M4 de cuatro rotores (submarinos).
• Rotores I a VIII, Beta y Gamma, con su cableado y sus muescas originales.
• Reflectores A, B y C, y los reflectores finos de la M4.
• Anillos (Ringstellung) y posición inicial (Grundstellung) de cada rotor.
• Clavijero con cables: toca dos letras para unirlas, hasta 13 pares.
• El famoso "doble paso" del rotor central, como en la máquina de verdad.

MUY VISUAL
• Ventanillas de los rotores que giras con el dedo, panel de lámparas que se encienden y teclado con vibración.
• Recorrido de la señal: mira el camino de cada letra por el clavijero, los rotores y el reflector, con todo el cableado interno en la posición actual.

CIFRA Y DESCIFRA TEXTOS COMPLETOS
• Pega un texto y pásalo por la máquina de una vez. El resultado sale en grupos de 5 letras, como se transmitía por radio.
• Mensaje legible: las X se convierten en espacios y la Ñ se respeta.
• Traduce el mensaje a español, inglés, francés, alemán, italiano o portugués con Google Traductor.

UN MENSAJE REAL DE 1941
• Carga la clave del día y descifra un mensaje auténtico del frente oriental.

MANUAL COMPLETO EN ESPAÑOL
• Cómo funciona cada pieza, cómo configurarla paso a paso, cómo cifrar y descifrar, el procedimiento que usaban los operadores, ejemplos guiados y glosario de términos alemanes.

Un solo pago. Sin suscripciones, sin anuncios, sin cuentas. Funciona sin internet (salvo la traducción) y no recopila ningún dato.

Privacidad: https://enigma-teal-three.vercel.app/privacy.html
```

**URL de soporte**: `https://enigma-teal-three.vercel.app/support.html`
**URL de marketing** (opcional): `https://enigma-teal-three.vercel.app`
**Copyright**: `2026 Antonio Martínez`

### 8. Información para la revisión (App Review)

- **Inicio de sesión requerido**: No.
- **Contacto**: Antonio Martínez · tecnoapps15@gmail.com · tu teléfono.
- **Notas** (pégalas tal cual):
```
Máquina Enigma is a faithful simulator of the WWII Enigma cipher machine, for education and entertainment. It works fully offline and has no accounts, ads, in-app purchases or data collection.

How to test: open the "Clave" tab, scroll down and tap "Mensaje real de 1941". The app switches to "Texto" with a real 1941 message; tap "Pasar por la máquina" to decrypt it. On the "Máquina" tab, press and hold any key to see its lamp light up. The "Señal" tab draws the electrical path of the last key.

The "Traducir en Google Traductor" button only opens translate.google.com in the browser with the decrypted text.

Regarding encryption: the app implements the historical Enigma cipher as a simulation. It is not used to secure user data, nothing is stored or transmitted, and its source code is publicly available.
```

**Lanzamiento**: "Publicar manualmente esta versión" si quieres elegir el día; "automáticamente" si da igual.

Luego: **Agregar para revisión** → **Enviar a App Review**. La revisión suele tardar de 1 a 2 días.

### 9. Builds automáticos desde GitHub (opcional, recomendado)

1. En https://expo.dev/settings/access-tokens crea un token (nombre: `github-enigma`).
2. En https://github.com/g33ktony/enigma/settings/secrets/actions → **New repository secret** → nombre `EXPO_TOKEN`,
   valor: el token.
3. Desde entonces cada push a `main` que toque `mobile/` compila en EAS y sube a TestFlight.

Para una versión nueva: cambia `version` en `mobile/app.json` (por ejemplo `1.0.1`); el número de build sube solo.

---

## Cifrado y exportación (léelo una vez)

`mobile/app.json` declara `ITSAppUsesNonExemptEncryption: false`, así ASC no pregunta por cifrado en cada build.
El razonamiento: la Enigma es un cifrado histórico que la app simula. No protege datos del usuario, no transmite ni
guarda nada y su código es público (lo que en las reglas de exportación de EE. UU. lo deja fuera de control). Es la
misma postura que toman otros simuladores de Enigma de la tienda. No es asesoría legal: si prefieres ir a lo seguro,
cambia el valor a `true` y responde el cuestionario de cifrado de ASC al subir el build.

## Ficha en inglés (opcional)

La app solo está en español. Si agregas la localización English (U.S.), la descripción lo avisa en la primera línea
para que nadie la compre esperando inglés.

**Name**: `Enigma Cipher Machine` · **Subtitle**: `Encrypt like it's 1941`

**Promotional text**
```
The most famous cipher machine in history, true to the originals: rotors, plugboard and a real 1941 message to decode. One payment, no subscriptions.
```

**Keywords**
```
cryptography,code,secret,turing,bletchley,ww2,history,rotor,spy,decoder,german,cryptogram
```

**Description**
```
Note: the app's interface and manual are in Spanish.

Enigma Cipher Machine is a faithful simulator of the cipher machine Germany used in World War II. Press a letter, the rotors turn and another letter lights up, just like the original. Messages you encrypt here decrypt on a real Enigma, and vice versa.

• Enigma I, M3 and the four-rotor M4, with rotors I–VIII, Beta and Gamma, reflectors A, B, C and the thin M4 reflectors.
• Ring settings, start positions and a plugboard with cables, up to 13 pairs. Includes the famous double-stepping.
• Turn the rotors with your finger, watch the lamps light up and feel each key press.
• Signal path view: see each letter travel through the plugboard, rotors and reflector.
• Encrypt or decrypt whole texts, in five-letter groups like radio operators did, and translate the result with Google Translate.
• Decode a real message from 1941 with its original daily key.

One payment. No subscriptions, ads or accounts. Works offline and collects no data.
```

## Checklist

- [ ] Acuerdo de apps de pago activo (§1)
- [ ] App creada en ASC y `ascAppId` en `mobile/eas.json` (§2)
- [ ] Build subido y visible en TestFlight (§3)
- [ ] Precio MXN 49.00, sin compras dentro de la app (§4)
- [ ] Categorías, clasificación 4+ y URL de privacidad (§5)
- [ ] App Privacy: datos no recopilados (§6)
- [ ] Textos y 5 capturas de 6.9" (§7)
- [ ] Notas para revisión y envío (§8)
- [ ] `EXPO_TOKEN` en GitHub (§9, opcional)
