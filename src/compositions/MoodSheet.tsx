import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FocowebLogo } from "../components/FocowebLogo";
import { moodAnim } from "../components/moodAnim";
import { moods, moodNames } from "../components/expressions";
import { colors } from "../theme";

const { fontFamily } = loadFont();

/**
 * Todas las actitudes a la vez, cada una animándose en su propio ritmo.
 * Sirve para revisarlas de una sola mirada y decidir cuáles funcionan.
 */
export const MoodSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, durationInFrames } = useVideoConfig();

  const columns = 3;
  const cell = width / columns;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.night,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "flex-start",
        fontFamily,
      }}
    >
      {moodNames.map((name) => (
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
            anim={moodAnim({
              mood: name,
              frame,
              cycleInFrames: durationInFrames,
              withBackground: false,
            })}
            size={cell * 0.62}
          />
          <div
            style={{
              fontSize: cell * 0.058,
              fontWeight: 600,
              color: colors.white,
              letterSpacing: cell * 0.002,
            }}
          >
            {moods[name].label}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
