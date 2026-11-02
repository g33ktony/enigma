#!/bin/bash
# Compone las capturas de la App Store (iPhone 6.9", 1320×2868) a partir de docs/store/raw/*.png.
# Uso: bash docs/store/make-screenshots.sh   (desde la raíz del repo)
set -euo pipefail
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p iphone-6.9

shot() { # archivo título subtítulo
  local q
  q=$(node -e 'const [img,t,s]=process.argv.slice(1);console.log(new URLSearchParams({img,title:t,sub:s}).toString())' "file://$PWD/raw/$1" "$2" "$3")
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1320,2868 \
    --virtual-time-budget=4000 --screenshot="$PWD/iphone-6.9/$1" "file://$PWD/compose.html?$q" 2>/dev/null
  # App Store rechaza capturas con canal alfa: se guardan como JPEG.
  sips -s format jpeg -s formatOptions 92 "iphone-6.9/$1" --out "iphone-6.9/${1%.png}.jpg" >/dev/null
  rm "iphone-6.9/$1"
  echo "iphone-6.9/${1%.png}.jpg"
}

shot 01-maquina.png 'La Enigma real,<br>en tu iPhone' 'Pulsa una tecla y mira encenderse la lámpara.'
shot 02-clave.png 'Configúrala como<br>las originales' 'Rotores I–VIII, anillos, reflector y clavijero con cables.'
shot 03-senal.png 'Sigue la corriente<br>letra por letra' 'El camino de cada letra por los rotores y el reflector.'
shot 04-texto.png 'Descifra un mensaje<br>real de 1941' 'Con mensaje legible y traducción a tu idioma.'
shot 05-manual.png 'Aprende a usarla<br>paso a paso' 'Manual completo en español, con ejemplos guiados.'
