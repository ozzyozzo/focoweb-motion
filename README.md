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

## Renderizar

```bash
npm run render:vertical     # out/sting-vertical.mp4
npm run render:square       # out/sting-square.mp4
npm run render:reel         # out/reel-intro.mp4
npm run render:alpha        # out/sting-alpha.mov  (ProRes 4444, para editores)
npm run render:alpha-webm   # out/sting-alpha.webm (VP8, más liviano, para web)
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
    Wordmark.tsx                El logotipo en texto
  compositions/
    LogoSting.tsx               Sting del logo, solo
    ReelIntro.tsx               Plantilla de Reel con mensaje
public/logo/                    El SVG original, corregido
```

## Ajustar el ritmo de la animación

Todo el timing del encendido vive en la constante `timeline` de
`src/components/useStingAnim.ts`, en frames a 30 fps:

```ts
export const timeline = {
  bodyIn: 0,           // entra la ampolleta con rebote
  filamentStart: 14,   // empieza a dibujarse el filamento "W"
  filamentEnd: 36,
  flashAt: 34,         // golpe de luz del encendido
  flashLength: 12,
  raysStart: 36,       // salen los rayos, escalonados
  rayStagger: 4,
  rayLength: 10,
  textStart: 46,       // aparece el texto
};
```

Deja el Studio abierto mientras editas: recarga en caliente y ves el cambio al instante.

## Nota sobre el SVG del logo

El archivo original tenía un problema: el gradiente `bulbGlow` usaba
`gradientUnits="objectBoundingBox"` (el valor por defecto). Las tres piezas que
son líneas perfectamente verticales u horizontales —el rayo de arriba y las dos
líneas de la rosca— tienen una caja de tamaño cero en algún eje, así que el
gradiente quedaba degenerado y el navegador simplemente no las pintaba.

La copia en `public/logo/focoweb-logo.svg` ya está corregida con
`gradientUnits="userSpaceOnUse"`. Conviene aplicar el mismo cambio al archivo
maestro en `~/biz/focoweb/logo/`. De paso, esa copia también tiene quitada la
metadata C2PA, que pesaba 7,7 KB de los 9,3 KB del archivo.

## Publicar en redes

- **Formato**: 1080×1920 a 30 fps, H.264 + AAC. Es lo que aceptan Instagram, TikTok y YouTube Shorts sin recomprimir de más.
- **Zona segura**: deja lo importante dentro del 80% central en vertical; las apps tapan los bordes con su interfaz.
- **Duración del sting**: entre 1,5 y 2,5 segundos. Más largo que eso cansa.
- **Para montar con otros clips**: usa `sting-alpha.mov` en Kdenlive o DaVinci Resolve y ponlo en una pista encima del video.
