import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FocowebLogo } from "../components/FocowebLogo";
import { moodAnim } from "../components/moodAnim";
import type { MoodName } from "../components/expressions";
import { colors } from "../theme";

export type MoodLoopProps = {
  /** neutral, feliz, emocionado, triste, frustrado, sorprendido,
   *  pensando, confundido o dormido */
  mood: MoodName;
  withBackground: boolean;
  /** Tamaño del personaje como fracción del ancho del video (0 a 1) */
  logoScale: number;
};

/** El personaje sosteniendo una actitud, en loop. Pensado para recortarlo
 *  y pegarlo encima de otro video, como un sticker. */
export const MoodLoop: React.FC<MoodLoopProps> = ({
  mood,
  withBackground,
  logoScale,
}) => {
  const frame = useCurrentFrame();
  const { width, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: withBackground ? colors.night : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FocowebLogo
        anim={moodAnim({
          mood,
          frame,
          cycleInFrames: durationInFrames,
          withBackground,
        })}
        size={width * logoScale}
      />
    </AbsoluteFill>
  );
};

export const defaultMoodProps: MoodLoopProps = {
  mood: "feliz",
  withBackground: true,
  logoScale: 0.55,
};
