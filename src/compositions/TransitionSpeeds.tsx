import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FocowebLogo } from "../components/FocowebLogo";
import { performanceAnim } from "../components/performance";
import { colors } from "../theme";

const { fontFamily } = loadFont();

/** El mismo cambio de actitud a tres velocidades, para comparar. */
const SPEEDS = [
  { transition: 4, note: "Reacción de golpe" },
  { transition: 12, note: "Cambio normal" },
  { transition: 30, note: "Se va apagando" },
];

const CHANGE_AT = 30;

export const TransitionSpeeds: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const cell = width / SPEEDS.length;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.night,
        flexDirection: "row",
        alignItems: "center",
        fontFamily,
      }}
    >
      {SPEEDS.map((speed) => (
        <div
          key={speed.transition}
          style={{
            width: cell,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: cell * 0.03,
          }}
        >
          <FocowebLogo
            anim={performanceAnim({
              beats: [
                { mood: "feliz", at: 0 },
                {
                  mood: "frustrado",
                  at: CHANGE_AT,
                  transition: speed.transition,
                },
              ],
              frame,
              fps,
              withBackground: false,
            })}
            size={cell * 0.52}
          />
          <div
            style={{
              fontSize: cell * 0.085,
              fontWeight: 700,
              color: colors.white,
            }}
          >
            transition: {speed.transition}
          </div>
          <div
            style={{
              fontSize: cell * 0.055,
              fontWeight: 500,
              color: colors.muted,
            }}
          >
            {speed.note}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
