import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FocowebLogo } from "../components/FocowebLogo";
import { performanceAnim, type MoodBeat } from "../components/performance";
import type { GestureCue } from "../components/gestures";
import { colors } from "../theme";

export type SceneProps = {
  /** El guion: qué siente el personaje y desde qué frame */
  beats: MoodBeat[];
  /** Gestos puntuales, que se suman encima de la actitud */
  cues: GestureCue[];
  withBackground: boolean;
  /** Tamaño del personaje como fracción del ancho del video (0 a 1) */
  logoScale: number;
};

/**
 * El personaje actuando un guion de actitudes. Es la pieza que sirve para
 * armar videos largos: en vez de escribir una animación por video, se escribe
 * la lista de momentos y el personaje los interpreta.
 */
export const Scene: React.FC<SceneProps> = ({
  beats,
  cues,
  withBackground,
  logoScale,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: withBackground ? colors.night : "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FocowebLogo
        anim={performanceAnim({ beats, cues, frame, fps, withBackground })}
        size={width * logoScale}
      />
    </AbsoluteFill>
  );
};

/**
 * Guion de ejemplo, el clásico "se le prende la idea":
 * le está dando vueltas, no le sale, se frustra, y de golpe se le ocurre.
 */
export const defaultSceneProps: SceneProps = {
  beats: [
    { mood: "pensando", at: 0 },
    { mood: "confundido", at: 45 },
    { mood: "frustrado", at: 90, transition: 6 },
    { mood: "sorprendido", at: 140, transition: 4 },
    { mood: "emocionado", at: 158 },
    { mood: "feliz", at: 200, transition: 20 },
  ],
  cues: [
    { gesture: "negar", at: 96 },
    { gesture: "idea", at: 140 },
    { gesture: "salto", at: 162 },
    { gesture: "risa", at: 200 },
  ],
  withBackground: true,
  logoScale: 0.55,
};
