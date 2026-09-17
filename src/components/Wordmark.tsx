import React from "react";
import { colors } from "../theme";

type Props = {
  fontFamily: string;
  fontSize: number;
  opacity: number;
  translateY: number;
};

/** Logotipo en texto: "foco" en blanco, "web" en el naranja de la marca. */
export const Wordmark: React.FC<Props> = ({
  fontFamily,
  fontSize,
  opacity,
  translateY,
}) => (
  <div
    style={{
      fontFamily,
      fontSize,
      fontWeight: 700,
      letterSpacing: -fontSize * 0.02,
      color: colors.white,
      opacity,
      transform: `translateY(${translateY}px)`,
      display: "flex",
      lineHeight: 1,
    }}
  >
    <span>foco</span>
    <span
      style={{
        background: `linear-gradient(135deg, ${colors.glowStart}, ${colors.glowEnd})`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      web
    </span>
  </div>
);
