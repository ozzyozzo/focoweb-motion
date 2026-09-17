import { interpolate, spring, Easing } from "remotion";
import type { LogoAnim } from "./FocowebLogo";

/**
 * Línea de tiempo del "sting" del logo, en frames a 30 fps.
 * Cambia estos números para ajustar el ritmo de la animación.
 */
export const timeline = {
  /** La ampolleta entra con rebote */
  bodyIn: 0,
  /** Empieza a dibujarse el filamento */
  filamentStart: 14,
  filamentEnd: 36,
  /** Golpe de luz del encendido */
  flashAt: 34,
  flashLength: 12,
  /** Salen las orejas, una después de la otra */
  earsStart: 36,
  earStagger: 4,
  earLength: 10,
  /** Aparece el texto */
  textStart: 46,
} as const;

type Options = {
  frame: number;
  fps: number;
  /** false para renders con canal alfa (sin el cuadrado azul) */
  withBackground?: boolean;
};

export const useStingAnim = ({
  frame,
  fps,
  withBackground = true,
}: Options): LogoAnim => {
  // Entrada de la ampolleta con rebote suave
  const bodySpring = spring({
    frame: frame - timeline.bodyIn,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 120 },
  });
  const bodyScale = interpolate(bodySpring, [0, 1], [0.55, 1]);
  const bodyOpacity = interpolate(frame, [timeline.bodyIn, timeline.bodyIn + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // El filamento se dibuja de izquierda a derecha
  const filament = interpolate(
    frame,
    [timeline.filamentStart, timeline.filamentEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );

  // Golpe de luz del encendido: sube rápido, baja lento
  const flash = interpolate(
    frame,
    [
      timeline.flashAt - 2,
      timeline.flashAt + 2,
      timeline.flashAt + timeline.flashLength,
    ],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );

  // Resplandor: pico en el encendido, luego respiración constante
  const ignition = interpolate(
    frame,
    [timeline.flashAt - 4, timeline.flashAt + 3, timeline.flashAt + 16],
    [0, 1, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const breathing = 0.08 * Math.sin((frame / fps) * Math.PI * 1.1);
  const glow = Math.max(0, ignition + (frame > timeline.flashAt + 16 ? breathing : 0));

  // Las dos orejas salen una después de la otra
  const ear = (index: number) => {
    const start = timeline.earsStart + index * timeline.earStagger;
    return interpolate(frame, [start, start + timeline.earLength], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.6)),
    });
  };

  return {
    bodyScale,
    bodyOpacity,
    filament,
    glow,
    ears: [ear(0), ear(1)],
    flash,
    background: withBackground ? 1 : 0,
  };
};
