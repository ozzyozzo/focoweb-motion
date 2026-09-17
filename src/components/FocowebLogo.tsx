import React from "react";
import { colors, LOGO_VIEWBOX } from "../theme";
import { FACES, facePathData, type FaceShape } from "./expressions";

/**
 * Estado de animación del logo. Cada campo controla una pieza del SVG,
 * de modo que las composiciones deciden el "cuándo" y este componente
 * solo se encarga del "cómo se ve".
 */
export type LogoAnim = {
  /** Escala del cuerpo de la ampolleta (vidrio, cuello, rosca, base) */
  bodyScale: number;
  /** Opacidad del cuerpo */
  bodyOpacity: number;
  /** Cuánto del filamento está dibujado, de 0 a 1 */
  filament: number;
  /** Intensidad del resplandor del filamento, de 0 a 1 */
  glow: number;
  /** Progreso de dibujo de cada oreja, de 0 a 1 */
  ears: [number, number];
  /** Opacidad del flash radial del encendido, de 0 a 1 */
  flash: number;
  /** Opacidad del fondo azul noche (0 = fondo transparente) */
  background: number;

  // --- Controles de personaje ---

  /** Grados que rota cada oreja sobre su base. Positivo = hacia afuera. */
  earTilt: [number, number];
  /** Aplastado y estirado. Positivo aplasta (ancho y bajo), negativo estira. */
  squash: number;
  /** Grados que se inclina todo el cuerpo, sobre la base del casquillo */
  tilt: number;
  /** Desplazamiento vertical del personaje, en unidades del viewBox */
  bob: number;
  /** Forma de la cara. Usa las de `expressions.ts` o mézclalas con `mixFace`. */
  face: FaceShape;
};

export const idleAnim: LogoAnim = {
  bodyScale: 1,
  bodyOpacity: 1,
  filament: 1,
  glow: 0.5,
  ears: [1, 1],
  flash: 0,
  background: 1,
  earTilt: [0, 0],
  squash: 0,
  tilt: 0,
  bob: 0,
  face: FACES.neutral,
};

/** Las dos orejas, definidas desde el extremo pegado a la ampolleta hacia
 *  afuera, para que el trazo se dibuje saliendo de ella.
 *  El pivote es ese mismo extremo interior: es el punto sobre el que rotan. */
const EARS = [
  { d: "M 136 98 L 116 78", pivot: [136, 98], direction: -1 },
  { d: "M 264 98 L 284 78", pivot: [264, 98], direction: 1 },
] as const;

/** Pivote del personaje: la punta del casquillo, o sea donde "se apoya". */
const FEET = [200, 344] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Props = {
  anim: LogoAnim;
  /** Tamaño del logo en píxeles (es cuadrado) */
  size: number;
};

export const FocowebLogo: React.FC<Props> = ({ anim, size }) => {
  const {
    bodyScale,
    bodyOpacity,
    filament,
    glow,
    ears,
    flash,
    background,
    earTilt,
    squash,
    tilt,
    bob,
    face,
  } = anim;

  // Aplastar y estirar conserva el volumen: lo que se ensancha, se acorta.
  const squashX = 1 + squash * 0.16;
  const squashY = 1 - squash * 0.16;

  /** El personaje se mueve, se inclina y se deforma siempre desde sus pies. */
  const characterTransform = [
    `translate(0 ${bob})`,
    `translate(${FEET[0]} ${FEET[1]})`,
    `rotate(${tilt})`,
    `scale(${squashX} ${squashY})`,
    `translate(${-FEET[0]} ${-FEET[1]})`,
  ].join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${LOGO_VIEWBOX} ${LOGO_VIEWBOX}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* gradientUnits="userSpaceOnUse" es obligatorio aquí: con el valor
            por defecto (objectBoundingBox) las líneas perfectamente
            horizontales, como las dos de la rosca, tienen caja de altura
            cero y el navegador no las pinta. Así además el degradado es
            continuo a lo largo de todo el isotipo. */}
        <linearGradient
          id="bulbGlow"
          gradientUnits="userSpaceOnUse"
          x1="110"
          y1="48"
          x2="290"
          y2="344"
        >
          <stop offset="0%" stopColor={colors.glowStart} />
          <stop offset="100%" stopColor={colors.glowEnd} />
        </linearGradient>

        <radialGradient id="flashGlow">
          <stop offset="0%" stopColor={colors.glowStart} stopOpacity={0.9} />
          <stop offset="45%" stopColor={colors.halo} stopOpacity={0.35} />
          <stop offset="100%" stopColor={colors.glowEnd} stopOpacity={0} />
        </radialGradient>

        {/* Recorta el resplandor interior para que no se salga del vidrio */}
        <clipPath id="glassClip">
          <circle cx="200" cy="188" r="98" />
        </clipPath>
      </defs>

      {/* Fondo azul noche. Queda fuera del personaje: no se mueve con él. */}
      <rect
        x="0"
        y="0"
        width="400"
        height="400"
        rx="72"
        fill={colors.night}
        opacity={background}
      />

      <g transform={characterTransform}>
        {/* Orejas: se dibujan saliendo de la ampolleta y rotan sobre su base */}
        <g
          stroke="url(#bulbGlow)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity={0.9}
          style={{ filter: `drop-shadow(0 0 ${6 * glow}px ${colors.halo})` }}
        >
          {EARS.map((ear, i) => (
            <path
              key={ear.d}
              d={ear.d}
              fill="none"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={clamp01(1 - ears[i])}
              transform={`rotate(${earTilt[i] * ear.direction} ${ear.pivot[0]} ${ear.pivot[1]})`}
            />
          ))}
        </g>

        {/* Cuerpo de la ampolleta: escala desde su propio centro */}
        <g
          opacity={bodyOpacity}
          transform={`translate(200 200) scale(${bodyScale}) translate(-200 -200)`}
        >
          {/* Vidrio */}
          <circle
            cx="200"
            cy="188"
            r="98"
            fill={colors.glass}
            stroke="url(#bulbGlow)"
            strokeWidth="10"
          />

          {/* Resplandor interior cuando la cara está encendida */}
          <g clipPath="url(#glassClip)">
            <circle
              cx="200"
              cy="196"
              r="98"
              fill="url(#flashGlow)"
              opacity={glow * 0.55}
            />
          </g>

          {/* Cuello */}
          <path
            d="M 168 274 L 168 302 Q 168 314 180 314 L 220 314 Q 232 314 232 302 L 232 274 Z"
            fill={colors.glass}
            stroke="url(#bulbGlow)"
            strokeWidth="10"
            strokeLinejoin="round"
          />

          {/* Rosca */}
          <line
            x1="166"
            y1="290"
            x2="234"
            y2="290"
            stroke="url(#bulbGlow)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="168"
            y1="304"
            x2="232"
            y2="304"
            stroke="url(#bulbGlow)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Base */}
          <path
            d="M 176 318 L 224 318 L 220 336 Q 218 344 208 344 L 192 344 Q 182 344 180 336 Z"
            fill="url(#bulbGlow)"
          />

          {/* La cara: la "W" completa, que se dibuja y luego cambia de forma */}
          <path
            d={facePathData(face)}
            fill="none"
            stroke="url(#bulbGlow)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={clamp01(1 - filament)}
            style={{
              filter: `drop-shadow(0 0 ${4 + 22 * glow}px ${colors.halo})`,
            }}
          />
        </g>
      </g>

      {/* Flash radial del momento del encendido */}
      {flash > 0 ? (
        <circle
          cx="200"
          cy="188"
          r={130 + 90 * flash}
          fill="url(#flashGlow)"
          opacity={flash}
          style={{ mixBlendMode: "screen" }}
        />
      ) : null}
    </svg>
  );
};
