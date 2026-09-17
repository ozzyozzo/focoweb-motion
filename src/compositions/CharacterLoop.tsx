import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FocowebLogo } from "../components/FocowebLogo";
import { useCharacterAnim } from "../components/useCharacterAnim";
import { Wordmark } from "../components/Wordmark";
import { colors } from "../theme";

const { fontFamily } = loadFont();

export type CharacterLoopProps = {
  showWordmark: boolean;
  tagline: string;
  withBackground: boolean;
  /** Tamaño del isotipo como fracción del ancho del video (0 a 1) */
  logoScale: number;
};

/**
 * El personaje en reposo, en loop perfecto: empieza y termina en la misma
 * pose, así que se puede repetir sin corte. Sirve como fondo animado, como
 * cierre de un Reel o como sticker.
 */
export const CharacterLoop: React.FC<CharacterLoopProps> = ({
  showWordmark,
  tagline,
  withBackground,
  logoScale,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const anim = useCharacterAnim({ frame, durationInFrames, withBackground });

  const logoSize = width * logoScale;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: withBackground ? colors.night : "transparent",
        justifyContent: "center",
        alignItems: "center",
        gap: height * 0.03,
      }}
    >
      <FocowebLogo anim={anim} size={logoSize} />

      {showWordmark ? (
        <Wordmark
          fontFamily={fontFamily}
          fontSize={logoSize * 0.2}
          opacity={1}
          translateY={0}
        />
      ) : null}

      {tagline ? (
        <div
          style={{
            fontFamily,
            fontSize: logoSize * 0.075,
            fontWeight: 500,
            color: colors.muted,
            letterSpacing: logoSize * 0.004,
            textAlign: "center",
            maxWidth: width * 0.8,
          }}
        >
          {tagline}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const defaultCharacterProps: CharacterLoopProps = {
  showWordmark: true,
  tagline: "Sitios web que sí venden",
  withBackground: true,
  logoScale: 0.45,
};
