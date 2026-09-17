import type { LogoAnim } from "./FocowebLogo";
import { moods, type MoodName } from "./expressions";

type Options = {
  mood: MoodName;
  frame: number;
  durationInFrames: number;
  withBackground?: boolean;
};

/**
 * El personaje sosteniendo una actitud, en loop perfecto.
 *
 * Toma la pose de base de la actitud y le suma su manera propia de moverse:
 * el feliz rebota, el triste apenas respira, el frustrado tiembla.
 *
 * No es un hook de React, es una función pura del frame, así que se puede
 * llamar varias veces en el mismo render, por ejemplo dentro de un `.map()`
 * para mostrar todas las actitudes a la vez.
 *
 * Igual que en el ciclo de reposo, todo se calcula sobre una fase que da
 * exactamente una vuelta a lo largo de la composición, y cada frecuencia es
 * un número entero, así que el último frame empalma con el primero.
 */
export const moodAnim = ({
  mood,
  frame,
  durationInFrames,
  withBackground = true,
}: Options): LogoAnim => {
  const m = moods[mood];
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const { motion } = m;

  const bob = m.bob - motion.bobAmp * Math.sin(motion.bobFreq * phase);
  const flap = motion.earAmp * Math.sin(motion.earFreq * phase - 0.55);
  const shake = motion.shakeAmp * Math.sin(motion.shakeFreq * phase);

  return {
    bodyScale: 1,
    bodyOpacity: 1,
    filament: 1,
    glow: Math.max(0, m.glow + 0.08 * Math.sin(2 * phase)),
    ears: [1, 1],
    flash: 0,
    background: withBackground ? 1 : 0,
    earTilt: [m.ears[0] + flap, m.ears[1] + flap],
    // El aplastado acompaña a la flotación: se achata cuando baja.
    squash: m.squash + 0.12 * Math.sin(motion.bobFreq * phase),
    tilt: m.tilt + shake,
    bob,
    face: m.face,
  };
};
