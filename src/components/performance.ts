import { Easing, interpolate } from "remotion";
import type { LogoAnim } from "./FocowebLogo";
import { mixFace, type MoodName } from "./expressions";
import { moodAnim } from "./moodAnim";
import { decay } from "./motion";

/** Un momento del guion: a partir del frame `at`, el personaje siente esto. */
export type MoodBeat = {
  mood: MoodName;
  /** Frame en que empieza a adoptar la actitud */
  at: number;
  /** Cuántos frames tarda el cambio. Por defecto 10, o sea un tercio de segundo. */
  transition?: number;
};

const DEFAULT_TRANSITION = 10;

/** Cuántos frames dura una vuelta del movimiento de reposo dentro de una escena. */
export const SCENE_CYCLE_SECONDS = 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mezcla dos poses completas. t = 0 devuelve `a`, t = 1 devuelve `b`. */
const blend = (a: LogoAnim, b: LogoAnim, t: number): LogoAnim => ({
  bodyScale: lerp(a.bodyScale, b.bodyScale, t),
  bodyOpacity: lerp(a.bodyOpacity, b.bodyOpacity, t),
  filament: lerp(a.filament, b.filament, t),
  glow: lerp(a.glow, b.glow, t),
  ears: [lerp(a.ears[0], b.ears[0], t), lerp(a.ears[1], b.ears[1], t)],
  flash: lerp(a.flash, b.flash, t),
  background: b.background,
  earTilt: [
    lerp(a.earTilt[0], b.earTilt[0], t),
    lerp(a.earTilt[1], b.earTilt[1], t),
  ],
  squash: lerp(a.squash, b.squash, t),
  tilt: lerp(a.tilt, b.tilt, t),
  bob: lerp(a.bob, b.bob, t),
  face: mixFace(a.face, b.face, t),
});

type Options = {
  /** El guion, en orden. Si viene desordenado se ordena solo. */
  beats: MoodBeat[];
  frame: number;
  fps: number;
  withBackground?: boolean;
};

/**
 * El personaje actuando un guion de actitudes.
 *
 * Recibe una lista de momentos y en cada frame mezcla la actitud que viene
 * saliendo con la que entra. Como cada actitud sigue moviéndose con su propio
 * ritmo durante la mezcla, el cambio nunca se ve como un fundido entre dos
 * fotos: el personaje pasa de un estado al otro moviéndose.
 *
 * Además cada cambio suelta un pequeño impulso que se va apagando, para que la
 * transición se lea como una reacción y no como una interpolación. Sin eso,
 * pasar de pensando a frustrado se siente correcto pero muerto.
 */
export const performanceAnim = ({
  beats,
  frame,
  fps,
  withBackground = true,
}: Options): LogoAnim => {
  if (beats.length === 0) {
    throw new Error("performanceAnim necesita al menos un momento en `beats`");
  }

  const script = [...beats].sort((a, b) => a.at - b.at);
  const cycleInFrames = fps * SCENE_CYCLE_SECONDS;

  const poseAt = (mood: MoodName) =>
    moodAnim({ mood, frame, cycleInFrames, withBackground });

  // El último momento que ya empezó. Antes del primero, se usa el primero.
  let index = 0;
  for (let i = 0; i < script.length; i++) {
    if (frame >= script[i].at) {
      index = i;
    }
  }

  const current = script[index];
  let pose = poseAt(current.mood);

  if (index > 0) {
    const previous = script[index - 1];
    const length = current.transition ?? DEFAULT_TRANSITION;
    const t = interpolate(frame, [current.at, current.at + length], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    pose = blend(poseAt(previous.mood), pose, t);
  }

  // Cada cambio de actitud sacude al personaje: acusa el golpe y se acomoda.
  const impulse = script.reduce((sum, beat, i) => {
    if (i === 0) {
      return sum;
    }
    return (
      sum +
      decay({ frame, fps, start: beat.at, frequency: 2.6, halfLife: 0.26 })
    );
  }, 0);

  return {
    ...pose,
    squash: pose.squash + impulse * 0.3,
    earTilt: [
      pose.earTilt[0] + impulse * 10,
      pose.earTilt[1] + impulse * 10,
    ],
    bob: pose.bob + impulse * 4,
  };
};
