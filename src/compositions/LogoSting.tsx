import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FocowebLogo } from "../components/FocowebLogo";
import { useStingAnim, timeline } from "../components/useStingAnim";
import { Wordmark } from "../components/Wordmark";
import { colors } from "../theme";

const { fontFamily } = loadFont();

export type LogoStingProps = {
  /** Muestra el logotipo "focoweb" debajo del isotipo */
  showWordmark: boolean;
  /** Frase corta bajo el logotipo. Deja "" para ocultarla. */
  tagline: string;
  /** false = fondo transparente, para superponer sobre otro video */
  withBackground: boolean;
  /** Tamaño del isotipo como fracción del ancho del video (0 a 1) */
  logoScale: number;
};

export const LogoSting: React.FC<LogoStingProps> = ({
  showWordmark,
  tagline,
  withBackground,
  logoScale,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const anim = useStingAnim({ frame, fps, withBackground });

  const logoSize = width * logoScale;

  const textOpacity = interpolate(
    frame,
    [timeline.textStart, timeline.textStart + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const textY = interpolate(
    frame,
    [timeline.textStart, timeline.textStart + 14],
    [18, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

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
          opacity={textOpacity}
          translateY={textY}
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
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
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

export const defaultStingProps: LogoStingProps = {
  showWordmark: true,
  tagline: "Sitios web que sí venden",
  withBackground: true,
  logoScale: 0.45,
};
