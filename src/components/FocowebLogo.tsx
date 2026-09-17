import React from "react";
import { colors, LOGO_VIEWBOX } from "../theme";

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
  /** Cuánto del filamento "W" está dibujado, de 0 a 1 */
  filament: number;
  /** Intensidad del resplandor del filamento, de 0 a 1 */
  glow: number;
  /** Progreso de cada oreja, de 0 a 1 */
  ears: [number, number];
  /** Opacidad del flash radial del encendido, de 0 a 1 */
  flash: number;
  /** Opacidad del fondo azul noche (0 = fondo transparente) */
  background: number;
};

export const idleAnim: LogoAnim = {
  bodyScale: 1,
  bodyOpacity: 1,
  filament: 1,
  glow: 0.5,
  ears: [1, 1],
  flash: 0,
  background: 1,
};

/** Las dos orejas, definidas desde el extremo pegado a la ampolleta hacia
 *  afuera, para que el trazo se dibuje saliendo de ella.
 *  El primer punto de cada una es también su pivote natural de rotación,
 *  por si más adelante se quieren mover como orejas de verdad. */
const EARS = [
  { d: "M 136 98 L 116 78", pivot: [136, 98] },
  { d: "M 264 98 L 284 78", pivot: [264, 98] },
] as const;

/** Un dashoffset fuera de [0,1] desplaza el patrón y abre huecos. */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const FILAMENT_PATH = "M 148 168 L 172 216 L 200 176 L 228 216 L 252 168";

type Props = {
  anim: LogoAnim;
  /** Tamaño del logo en píxeles (es cuadrado) */
  size: number;
};

export const FocowebLogo: React.FC<Props> = ({ anim, size }) => {
  const { bodyScale, bodyOpacity, filament, glow, ears, flash, background } =
    anim;

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
            verticales u horizontales tienen caja de tamaño cero y el
            navegador no las pinta. Así además el degradado es continuo a
            lo largo de todo el isotipo en vez de repetirse en cada pieza. */}
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

      {/* Fondo azul noche */}
      <rect
        x="0"
        y="0"
        width="400"
        height="400"
        rx="72"
        fill={colors.night}
        opacity={background}
      />

      {/* Orejas: se dibujan desde la ampolleta hacia afuera */}
      <g
        stroke="url(#bulbGlow)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity={0.9}
        style={{
          filter: `drop-shadow(0 0 ${6 * glow}px ${colors.halo})`,
        }}
      >
        {EARS.map((ear, i) => (
          <path
            key={ear.d}
            d={ear.d}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={clamp01(1 - ears[i])}
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

        {/* Resplandor interior del vidrio cuando el filamento está encendido */}
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

        {/* Filamento en "W": se dibuja de izquierda a derecha */}
        <path
          d={FILAMENT_PATH}
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
