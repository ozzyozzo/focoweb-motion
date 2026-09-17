import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FocowebLogo } from "../components/FocowebLogo";
import { useStingAnim } from "../components/useStingAnim";
import { Wordmark } from "../components/Wordmark";
import { colors } from "../theme";

const { fontFamily } = loadFont();

export type ReelIntroProps = {
  /** Titular grande, 2 a 5 palabras funciona mejor */
  headline: string;
  /** Puntos que entran uno a uno */
  bullets: string[];
  /** Llamado a la acción del final */
  cta: string;
  /** Frame en que el logo sube y empieza a entrar el texto */
  transitionAt: number;
  /** true = el isotipo se ve como icono con su cuadrado azul de fondo.
   *  false = solo la ampolleta, sin cuadrado. */
  logoTile: boolean;
};

/** Plantilla de Reel/TikTok vertical: el logo se enciende, sube,
 *  y debajo entra el mensaje línea por línea. */
export const ReelIntro: React.FC<ReelIntroProps> = ({
  headline,
  bullets,
  cta,
  transitionAt,
  logoTile,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const anim = useStingAnim({ frame, fps, withBackground: logoTile });

  // Progreso del viaje del logo desde el centro hacia arriba
  const travel = interpolate(frame, [transitionAt, transitionAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const logoSize = interpolate(travel, [0, 1], [width * 0.45, width * 0.22]);
  const logoTop = interpolate(
    travel,
    [0, 1],
    [height * 0.5 - width * 0.45 / 2, height * 0.1],
  );

  /** Helper de entrada: fade + desplazamiento hacia arriba */
  const enter = (start: number) => {
    const o = interpolate(frame, [start, start + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = interpolate(frame, [start, start + 16], [28, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return { opacity: o, transform: `translateY(${y}px)` };
  };

  const headlineStart = transitionAt + 12;
  const bulletsStart = headlineStart + 16;
  const ctaStart = durationInFrames - 60;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.night }}>
      {/* Halo suave de fondo, para que el azul no se vea plano */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 22%, ${colors.halo}22 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: logoTop,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <FocowebLogo anim={anim} size={logoSize} />
      </div>

      <div
        style={{
          position: "absolute",
          top: height * 0.1 + width * 0.22 + 28,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: travel,
        }}
      >
        <Wordmark
          fontFamily={fontFamily}
          fontSize={width * 0.062}
          opacity={1}
          translateY={0}
        />
      </div>

      {/* Bloque de mensaje */}
      <div
        style={{
          position: "absolute",
          top: height * 0.4,
          left: width * 0.09,
          width: width * 0.82,
          display: "flex",
          flexDirection: "column",
          gap: height * 0.022,
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: width * 0.095,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -width * 0.002,
            color: colors.white,
            whiteSpace: "pre-line",
            ...enter(headlineStart),
          }}
        >
          {headline}
        </div>

        {bullets.map((text, i) => (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: width * 0.028,
              fontSize: width * 0.048,
              fontWeight: 500,
              lineHeight: 1.3,
              color: colors.white,
              ...enter(bulletsStart + i * 14),
            }}
          >
            <span style={{ color: colors.glowStart, fontWeight: 700 }}>—</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Llamado a la acción */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.11,
          left: 0,
          width,
          display: "flex",
          justifyContent: "center",
          fontFamily,
          ...enter(ctaStart),
        }}
      >
        <div
          style={{
            padding: `${height * 0.018}px ${width * 0.07}px`,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${colors.glowStart}, ${colors.glowEnd})`,
            color: colors.night,
            fontSize: width * 0.05,
            fontWeight: 700,
          }}
        >
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const defaultReelProps: ReelIntroProps = {
  headline: "Tu sitio web,\nlisto en 7 días",
  bullets: [
    "Diseño hecho a medida",
    "Optimizado para Google",
    "Se ve perfecto en el celular",
  ],
  cta: "Escríbenos hoy",
  transitionAt: 60,
  logoTile: true,
};
