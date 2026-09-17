# focoweb-motion

Plantillas de video para las redes sociales de Focoweb, hechas con [Remotion](https://remotion.dev).
El logo se define como componente React, así que las animaciones se ajustan cambiando
números en el código y se renderizan a MP4, MOV o WebM desde la terminal.

## Requisitos

- Node 18 o superior (este proyecto se probó con Node 26)
- Chrome Headless, que Remotion descarga solo la primera vez que renderizas

## Puesta en marcha

```bash
npm install
npm run dev     # abre Remotion Studio en el navegador
```

El Studio muestra cada composición en la barra lateral, con una línea de tiempo
para moverte cuadro a cuadro y un panel para editar los textos en vivo.

## Composiciones

| id | Formato | Duración | Para qué sirve |
|---|---|---|---|
| `StingVertical` | 1080×1920 (9:16) | 3 s | Apertura o cierre de Reels, TikTok y Stories |
| `StingSquare` | 1080×1080 (1:1) | 3 s | Feed de Instagram y LinkedIn |
| `StingAlpha` | 1080×1080, fondo transparente | 3 s | Superponer el logo encima de otro video |
| `ReelIntro` | 1080×1920 (9:16) | 8 s | Reel completo: logo, titular, puntos y llamado a la acción |
| `CharacterLoop` | 1080×1080 (1:1) | 4 s | El personaje en reposo, en loop perfecto |
| `CharacterLoopAlpha` | 1080×1080, fondo transparente | 4 s | El mismo loop como sticker sobre otro video |
| `MoodLoop` | 1080×1080 | 4 s | Una actitud sostenida, en loop. Elige cuál con la prop `mood`. |
| `MoodSheet` | 1200×1200 | 4 s | Las nueve actitudes a la vez, para revisarlas |
| `Scene` | 1080×1080 | 8 s | El personaje actuando un guion de actitudes y gestos |
| `GestureSheet` | 1440×800 | 3 s | Los ocho gestos a la vez, para revisarlos |
| `TransitionSpeeds` | 1440×620 | 3 s | El mismo cambio a tres velocidades, para calibrar el ojo |

## Renderizar

```bash
npm run render:vertical     # out/sting-vertical.mp4
npm run render:square       # out/sting-square.mp4
npm run render:reel         # out/reel-intro.mp4
npm run render:loop         # out/character-loop.mp4
npm run moods               # out/mood-sheet.png, todas las actitudes de una mirada
npm run render:moods        # out/mood-sheet.mp4, las mismas pero en movimiento
npm run render:scene        # out/scene.mp4
npm run gestures            # out/gesture-sheet.mp4, los ocho gestos
npm run transiciones        # out/transition-speeds.mp4, transition 4 vs 12 vs 30
npm run render:ejemplo      # out/guion-ejemplo.mp4, desde examples/guion-ejemplo.json
npm run render:alpha        # out/sting-alpha.mov  (ProRes 4444, para editores)
npm run render:alpha-webm   # out/sting-alpha.webm (VP8, más liviano, para web)
npm run render:loop-alpha   # out/character-loop.webm (loop con transparencia)
npm run render:all
```

Para cambiar los textos sin tocar el código, pasa las props en la línea de comandos:

```bash
npx remotion render ReelIntro out/promo.mp4 --props='{
  "headline": "Tu negocio\nnecesita estar online",
  "bullets": ["Entrega en 7 días", "Sin mensualidades ocultas"],
  "cta": "Cotiza gratis",
  "transitionAt": 60,
  "logoTile": true
}'
```

## Cómo está organizado

```
src/
  theme.ts                      Paleta de marca, sacada del SVG original
  Root.tsx                      Registro de todas las composiciones
  components/
    FocowebLogo.tsx             El isotipo en SVG, con cada pieza animable
    useStingAnim.ts             La línea de tiempo del encendido
    useCharacterAnim.ts         El ciclo de reposo del personaje
    expressions.ts              Las caras y las actitudes del personaje
    moodAnim.ts                 Una actitud sostenida, en loop
    gestures.ts                 Los gestos puntuales
    performance.ts              El paso de una actitud a otra
    motion.ts                   Utilidades de movimiento compartidas
    Wordmark.tsx                El logotipo en texto
  compositions/
    LogoSting.tsx               Sting del logo, solo
    ReelIntro.tsx               Plantilla de Reel con mensaje
    CharacterLoop.tsx           El personaje vivo, en loop
    MoodLoop.tsx                Una actitud, para usarla de sticker
    MoodSheet.tsx               Las nueve actitudes juntas
    Scene.tsx                   El personaje actuando un guion
    GestureSheet.tsx            Los ocho gestos juntos
public/logo/                    El SVG original, corregido
```

## Ajustar el ritmo de la animación

Todo el timing del encendido vive en la constante `timeline` de
`src/components/useStingAnim.ts`, en frames a 30 fps:

```ts
export const timeline = {
  bodyIn: 0,           // entra la ampolleta con rebote
  faceStart: 14,       // empieza a dibujarse la cara
  faceEnd: 36,
  flashAt: 34,         // golpe de luz del encendido
  flashLength: 12,
  earsStart: 36,       // salen las orejas, una después de la otra
  earStagger: 4,
  earLength: 10,
  textStart: 46,       // aparece el texto
};
```

Deja el Studio abierto mientras editas: recarga en caliente y ves el cambio al instante.

## El logo como personaje

El isotipo no tiene ojos a propósito: la "W" es toda la cara. Las dos
diagonales de arriba funcionan como orejas y rotan sobre su base, que es el
extremo pegado a la ampolleta.

`LogoAnim`, en `src/components/FocowebLogo.tsx`, expone estos controles:

| Campo | Qué hace |
|---|---|
| `earTilt` | Grados que rota cada oreja. Positivo las abre hacia afuera, negativo las para. |
| `squash` | Aplastado y estirado. Positivo aplasta, negativo estira, y el volumen se conserva. |
| `tilt` | Inclinación de todo el cuerpo, sobre la base del casquillo. |
| `bob` | Desplazamiento vertical. Negativo es hacia arriba. |
| `face` | La forma de la "W". Sale de la librería de expresiones. |

### Las actitudes

`src/components/expressions.ts` guarda nueve actitudes: `neutral`, `feliz`,
`emocionado`, `triste`, `frustrado`, `sorprendido`, `pensando`, `confundido`
y `dormido`.

Cada una es una pose completa —forma de la cara, ángulo de las orejas,
aplastado, inclinación, resplandor— más su propia manera de moverse: el feliz
rebota, el triste apenas respira, el frustrado tiembla rápido.

Todas las caras son variantes de la misma "W": cinco puntos, siempre en el
mismo orden, siempre diez números. Por eso se puede mezclar cualquier cara con
cualquier otra punto por punto, con `mixFace`, y pasar de una emoción a la
siguiente sin cortes:

```ts
import { FACES, mixFace } from "./components/expressions";

// A mitad de camino entre neutral y feliz
const face = mixFace(FACES.neutral, FACES.feliz, 0.5);
```

Para verlas todas: `npm run moods` deja un PNG con las nueve, y
`npm run render:moods` las deja en movimiento.

Para sacar una sola como sticker:

```bash
npx remotion render MoodLoop out/frustrado.webm \
  --props='{"mood":"frustrado","withBackground":false,"logoScale":0.55}' \
  --codec=vp8 --image-format=png --pixel-format=yuva420p
```

### Escenas: pasar de una actitud a otra

Para un video largo no sirve una actitud sostenida, sirve el cambio. `Scene`
recibe un guion —qué siente el personaje y desde qué frame— y lo interpreta:

```bash
npx remotion render Scene out/idea.mp4 --props='{
  "beats": [
    { "mood": "pensando",    "at": 0 },
    { "mood": "confundido",  "at": 45 },
    { "mood": "frustrado",   "at": 90,  "transition": 6 },
    { "mood": "sorprendido", "at": 140, "transition": 4 },
    { "mood": "emocionado",  "at": 158 },
    { "mood": "feliz",       "at": 200, "transition": 20 }
  ],
  "withBackground": true,
  "logoScale": 0.55
}'
```

`at` es el frame en que empieza el cambio y `transition` cuántos frames tarda,
10 por omisión. A 30 fps, 30 frames es un segundo.

Para calibrar el ojo con `transition`, `npm run transiciones` muestra el mismo
cambio a tres velocidades, lado a lado:

| `transition` | Cómo se siente | Cuándo usarlo |
|---|---|---|
| 3 a 6 | Reacción de golpe | Un susto, una idea que llega, algo que interrumpe |
| 8 a 14 | Cambio normal | El ánimo cambia por algo que pasó |
| 20 a 30 | Se va apagando, o creciendo de a poco | Resignarse, calmarse, entusiasmarse despacio |

### Cómo se arma un guion

El orden que funciona, y por qué en ese orden:

1. **Escribe el arco en palabras**, no en frames. "Está tranquilo, algo lo
   sorprende, se frustra, lo piensa, se le ocurre, se alegra."
2. **Reparte los momentos en el tiempo.** A 30 fps, cada actitud necesita
   como mínimo 20 o 25 frames para leerse. Menos que eso y el espectador no
   alcanza a registrarla.
3. **Elige la velocidad de cada cambio** con la tabla de arriba. No todos los
   cambios van a la misma velocidad: ahí está casi toda la actuación.
4. **Recién entonces agrega los gestos**, en los golpes fuertes. Un gesto sin
   un cambio de actitud detrás se ve como un tic.
5. **Renderiza y ajusta.** Casi siempre lo primero queda demasiado rápido.

`examples/guion-ejemplo.json` tiene un guion completo armado así, y
`npm run render:ejemplo` lo renderiza. Conviene copiarlo y editarlo antes que
escribir uno desde cero.

Dos decisiones detrás de que esto se vea actuado y no interpolado:

- **Las dos actitudes se siguen moviendo durante la mezcla.** No se mezclan dos
  poses congeladas, se mezclan dos animaciones vivas. Sin esto el cambio se ve
  como un fundido entre dos fotos.
- **Cada cambio suelta un impulso que se apaga solo.** El personaje acusa el
  golpe con las orejas y el cuerpo, y se acomoda. Sin ese impulso la transición
  queda correcta pero muerta.

### Gestos puntuales

Una actitud es un estado que se sostiene; un gesto es una acción que ocurre y
termina. Por eso un gesto no reemplaza a la actitud, se le **suma encima**: el
personaje puede negar con la cabeza sin dejar de estar frustrado.

Hay ocho: `salto`, `asentir`, `negar`, `idea`, `susto`, `risa`, `saludo` y
`temblor`. Míralos con `npm run gestures`.

Se disparan desde la misma escena, en el arreglo `cues`:

```bash
npx remotion render Scene out/idea.mp4 --props='{
  "beats": [
    { "mood": "frustrado", "at": 0 },
    { "mood": "sorprendido", "at": 90, "transition": 4 },
    { "mood": "feliz", "at": 120 }
  ],
  "cues": [
    { "gesture": "negar", "at": 20 },
    { "gesture": "idea",  "at": 90 },
    { "gesture": "salto", "at": 112, "strength": 0.7 }
  ],
  "withBackground": true,
  "logoScale": 0.55
}'
```

`at` es el frame en que arranca el gesto y `strength` escala su intensidad, 1
por omisión. Los gestos se suman entre sí, así que dos que se pisan se
combinan en vez de pelearse.

**La regla de los gestos**: cada uno devuelve diferencias, no valores
absolutos, y todas valen cero al empezar y al terminar. Si escribes uno nuevo
que no arranca y termina en cero, se va a ver un salto al entrar o al salir.
Sin brazos ni ojos, el vocabulario disponible es el cuerpo, las orejas, el
brillo y la forma de la cara: `saludo`, por ejemplo, saluda moviendo una oreja
y dejando la otra quieta, porque si se mueven las dos no se lee como saludo.

Dentro de una escena el movimiento de reposo corre a un ritmo fijo de dos
segundos por vuelta, no estirado al largo del video. Por eso `moodAnim` recibe
`cycleInFrames` y no la duración: pasándole la duración queda en loop perfecto,
pasándole un valor fijo mantiene el ritmo. `MoodLoop` usa lo primero y `Scene`
lo segundo.

Dos advertencias sobre las caras, aprendidas probándolas: la tristeza tiene
que caer **pareja** hacia los dos lados y la frustración tiene que ser
**torcida**, o se confunden entre sí. Y la confusión se lee sobre todo en las
orejas descoordinadas, una parada y la otra caída, más que en la boca.

Las amplitudes del ciclo de reposo están en la constante `character` de
`src/components/useCharacterAnim.ts`. Subir `earFlap` o `squash` exagera el
gesto; bajarlos lo vuelve más serio.

**Regla del loop**: `useCharacterAnim` calcula todo sobre una fase que da
exactamente una vuelta a lo largo de la composición. Como cada término es un
múltiplo entero de esa fase (`sin(phase)`, `sin(2 * phase)`, …), el último
frame empalma con el primero. Si agregas movimiento, mantén esa regla o el
loop va a saltar.

## Nota sobre el SVG del logo

La copia en `public/logo/focoweb-logo.svg` tiene tres cambios respecto del
archivo original:

1. **El gradiente ahora usa `gradientUnits="userSpaceOnUse"`.** Con el valor por
   defecto (`objectBoundingBox`), las piezas que son líneas perfectamente
   verticales u horizontales tienen una caja de tamaño cero en algún eje: el
   gradiente queda degenerado y el navegador simplemente no las pinta. Por eso
   las dos líneas de la rosca nunca se veían.
2. **Se eliminó la línea vertical de arriba.** El original tenía tres rayos,
   pero uno de ellos era justamente una línea vertical afectada por el problema
   anterior, así que nunca se dibujó. El isotipo se diseñó alrededor de los dos
   rayos diagonales, que funcionan como orejas, así que la versión de dos es la
   buena y la vertical se quitó de verdad en vez de quedar oculta por accidente.
3. **Se quitó la metadata C2PA**, que pesaba 7,7 KB de los 9,3 KB del archivo.

El archivo maestro en `~/biz/focoweb/logo/focoweb-logo.svg` ya tiene los
mismos cambios aplicados. La versión anterior, con la metadata C2PA firmada,
quedó respaldada ahí mismo como `focoweb-logo.c2pa-backup.svg`.

## Publicar en redes

- **Formato**: 1080×1920 a 30 fps, H.264 + AAC. Es lo que aceptan Instagram, TikTok y YouTube Shorts sin recomprimir de más.
- **Zona segura**: deja lo importante dentro del 80% central en vertical; las apps tapan los bordes con su interfaz.
- **Duración del sting**: entre 1,5 y 2,5 segundos. Más largo que eso cansa.
- **Para montar con otros clips**: usa `sting-alpha.mov` en Kdenlive o DaVinci Resolve y ponlo en una pista encima del video.
