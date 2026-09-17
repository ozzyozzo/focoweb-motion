import { Easing, interpolate } from "remotion";
import { FACES, type FaceShape } from "./expressions";

/**
 * Gestos puntuales del personaje.
 *
 * A diferencia de las actitudes, que son estados que se sostienen, un gesto es
 * una acción: ocurre en un momento, dura un rato corto y termina. Por eso no
 * reemplaza a la actitud, se le suma encima. El personaje puede estar
 * frustrado y negar con la cabeza sin dejar de estar frustrado.
 *
 * Cada gesto devuelve diferencias, no valores absolutos, y todas valen cero al
 * empezar y al terminar. Esa es la regla que mantiene: si un gesto no arranca y
 * no termina en cero, se ve un salto al entrar o al salir.
 */
export type GestureDelta = {
  bob?: number;
  tilt?: number;
  squash?: number;
  earTilt?: [number, number];
  glow?: number;
  /** Hacia qué cara tirar la expresión, y cuánto, de 0 a 1 */
  facePull?: { face: FaceShape; amount: number };
};

export type GestureSpec = {
  label: string;
  /** Cuánto dura el gesto, en segundos */
  seconds: number;
  /** `t` va de 0 a 1 a lo largo del gesto. `strength` escala la intensidad. */
  delta: (t: number, strength: number) => GestureDelta;
};

/** Sube y baja suave: vale cero en las dos puntas. */
const envelope = (t: number) => Math.sin(Math.PI * t);

/** Oscilación que se apaga hacia el final del gesto. */
const fading = (t: number, cycles: number) =>
  Math.sin(t * cycles * Math.PI * 2) * (1 - t);

export const gestures = {
  salto: {
    label: "Salto",
    seconds: 0.8,
    delta: (t, s): GestureDelta => {
      // Se agacha, despega, vuela, aterriza y se acomoda.
      const bob = interpolate(
        t,
        [0, 0.15, 0.45, 0.62, 0.76, 1],
        [0, 9, -62, -12, 7, 0],
        { easing: Easing.inOut(Easing.quad) },
      );
      const squash = interpolate(
        t,
        [0, 0.15, 0.32, 0.62, 0.72, 0.86, 1],
        [0, 0.38, -0.3, -0.24, 0.46, -0.12, 0],
      );
      // Las orejas van siempre un paso atrás del cuerpo.
      const ear = interpolate(
        t,
        [0, 0.3, 0.6, 0.82, 1],
        [0, 24, -12, 9, 0],
      );
      return {
        bob: bob * s,
        squash: squash * s,
        earTilt: [ear * s, ear * s],
      };
    },
  },

  asentir: {
    label: "Asentir",
    seconds: 0.7,
    delta: (t, s): GestureDelta => ({
      bob: fading(t, 2) * 11 * s,
      squash: fading(t, 2) * 0.16 * s,
      earTilt: [fading(t, 2) * 7 * s, fading(t, 2) * 7 * s],
    }),
  },

  negar: {
    label: "Negar",
    seconds: 0.8,
    delta: (t, s): GestureDelta => ({
      tilt: fading(t, 2.5) * 15 * s,
      // Las orejas se cruzan al girar, que es lo que da el latigazo.
      earTilt: [fading(t, 2.5) * 12 * s, fading(t, 2.5) * -12 * s],
    }),
  },

  idea: {
    label: "Idea",
    seconds: 1,
    delta: (t, s): GestureDelta => {
      // Las orejas se paran de golpe y bajan despacio.
      const pop = interpolate(t, [0, 0.12, 0.4, 1], [0, 1, 0.75, 0], {
        easing: Easing.out(Easing.quad),
      });
      const hop = interpolate(t, [0, 0.12, 0.34, 0.5, 1], [0, -16, -4, -8, 0]);
      const spark = interpolate(t, [0, 0.1, 0.35, 1], [0, 1, 0.5, 0]);
      return {
        earTilt: [-34 * pop * s, -34 * pop * s],
        bob: hop * s,
        glow: 0.9 * spark * s,
        squash: -0.22 * pop * s,
        facePull: { face: FACES.emocionado, amount: 0.85 * envelope(t) },
      };
    },
  },

  susto: {
    label: "Susto",
    seconds: 0.6,
    delta: (t, s): GestureDelta => {
      const jolt = interpolate(t, [0, 0.08, 0.3, 0.55, 1], [0, 1, 0.55, 0.2, 0], {
        easing: Easing.out(Easing.quad),
      });
      return {
        bob: -24 * jolt * s,
        squash: -0.5 * jolt * s,
        earTilt: [-32 * jolt * s, -32 * jolt * s],
        glow: 0.5 * jolt * s,
        tilt: fading(t, 3) * 4 * s,
        facePull: { face: FACES.sorprendido, amount: 0.9 * envelope(t) },
      };
    },
  },

  risa: {
    label: "Risa",
    seconds: 1.2,
    delta: (t, s): GestureDelta => {
      const e = envelope(t);
      return {
        bob: Math.sin(t * 5 * Math.PI * 2) * 7 * e * s,
        squash: Math.sin(t * 5 * Math.PI * 2 + Math.PI / 2) * 0.22 * e * s,
        tilt: Math.sin(t * 2.5 * Math.PI * 2) * 3 * e * s,
        earTilt: [-10 * e * s, -10 * e * s],
        facePull: { face: FACES.feliz, amount: 0.9 * e },
      };
    },
  },

  saludo: {
    label: "Saludo",
    seconds: 1.1,
    delta: (t, s): GestureDelta => {
      // Sin brazos, saluda con una oreja: la izquierda va y viene,
      // la derecha se queda quieta para que el gesto se lea.
      const e = envelope(t);
      const wave = Math.sin(t * 3 * Math.PI * 2);
      return {
        earTilt: [(-26 + wave * 20) * e * s, -8 * e * s],
        tilt: 4 * e * s,
        bob: -4 * e * s,
        facePull: { face: FACES.feliz, amount: 0.7 * e },
      };
    },
  },

  temblor: {
    label: "Temblor",
    seconds: 0.9,
    delta: (t, s): GestureDelta => {
      const e = envelope(t);
      return {
        tilt: Math.sin(t * 9 * Math.PI * 2) * 3.5 * e * s,
        squash: Math.sin(t * 9 * Math.PI * 2 + Math.PI / 2) * 0.09 * e * s,
        earTilt: [8 * e * s, 8 * e * s],
      };
    },
  },
} as const satisfies Record<string, GestureSpec>;

export type GestureName = keyof typeof gestures;

export const gestureNames = Object.keys(gestures) as GestureName[];

/** Un gesto disparado en un momento del guion. */
export type GestureCue = {
  gesture: GestureName;
  /** Frame en que empieza */
  at: number;
  /** Escala la intensidad. 1 por omisión, 0.5 lo deja a media máquina. */
  strength?: number;
};
