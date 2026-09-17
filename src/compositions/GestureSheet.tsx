import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FocowebLogo } from "../components/FocowebLogo";
import { performanceAnim } from "../components/performance";
import { gestures, gestureNames } from "../components/gestures";
import { colors } from "../theme";

const { fontFamily } = loadFont();

/**
 * Los ocho gestos a la vez, cada uno disparado sobre una actitud neutral.
 * Todos arrancan en el mismo frame para poder compararlos, y el resto del
 * loop queda de aire para verlos acomodarse.
 */
export const GestureSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const columns = 4;
  const cell = width / columns;
  const fireAt = Math.round(fps * 0.5);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.night,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "center",
        fontFamily,
      }}
    >
      {gestureNames.map((name) => (
        <div
          key={name}
          style={{
            width: cell,
            height: cell,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: cell * 0.02,
          }}
        >
          <FocowebLogo
            anim={performanceAnim({
              beats: [{ mood: "neutral", at: 0 }],
              cues: [{ gesture: name, at: fireAt }],
              frame,
              fps,
              withBackground: false,
            })}
            size={cell * 0.52}
          />
          <div
            style={{
              fontSize: cell * 0.075,
              fontWeight: 600,
              color: colors.white,
            }}
          >
            {gestures[name].label}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
