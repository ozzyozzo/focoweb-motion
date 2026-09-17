import React from "react";
import { Composition } from "remotion";
import { LogoSting, defaultStingProps } from "./compositions/LogoSting";
import { ReelIntro, defaultReelProps } from "./compositions/ReelIntro";
import { fps } from "./theme";

/**
 * Cada <Composition> es un video que aparece en la barra lateral del Studio
 * y que puedes renderizar por su id con `npx remotion render <id>`.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Sting vertical 9:16 — para Reels, TikTok y Stories */}
      <Composition
        id="StingVertical"
        component={LogoSting}
        durationInFrames={90}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={defaultStingProps}
      />

      {/* Sting cuadrado 1:1 — para el feed de Instagram y LinkedIn */}
      <Composition
        id="StingSquare"
        component={LogoSting}
        durationInFrames={90}
        fps={fps}
        width={1080}
        height={1080}
        defaultProps={defaultStingProps}
      />

      {/* Sting con fondo transparente — para superponer sobre otro video.
          Renderiza con: npm run render:alpha */}
      <Composition
        id="StingAlpha"
        component={LogoSting}
        durationInFrames={90}
        fps={fps}
        width={1080}
        height={1080}
        defaultProps={{
          ...defaultStingProps,
          withBackground: false,
          showWordmark: false,
          tagline: "",
        }}
      />

      {/* Plantilla de Reel completa: logo + mensaje + llamado a la acción */}
      <Composition
        id="ReelIntro"
        component={ReelIntro}
        durationInFrames={fps * 8}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={defaultReelProps}
      />
    </>
  );
};
