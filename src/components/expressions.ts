/**
 * Librería de actitudes del personaje.
 *
 * La "W" es toda la cara, así que cada expresión es una variante de esa
 * misma "W": cinco puntos, siempre en el mismo orden, siempre diez números.
 * Gracias a eso se puede mezclar cualquier cara con cualquier otra punto por
 * punto, y pasar de una emoción a la siguiente sin cortes.
 *
 * Los cinco puntos, de izquierda a derecha:
 *   p0 punta izquierda · p1 valle · p2 punta central · p3 valle · p4 punta derecha
 *
 * Subir p0, p2 y p4 y bajar los valles abre la cara y la vuelve alegre.
 * Invertir la figura la cierra hacia abajo y la vuelve triste.
 */
export type FaceShape = readonly number[];

export const FACES = {
  /** La "W" del logo, tal cual */
  neutral: [148, 168, 172, 216, 200, 176, 228, 216, 252, 168],
  /** Más ancha y más profunda: sonrisa abierta */
  feliz: [138, 158, 168, 228, 200, 182, 232, 228, 262, 158],
  /** Igual que feliz pero al extremo */
  emocionado: [132, 150, 164, 234, 200, 178, 236, 234, 268, 150],
  /** La "W" dada vuelta y hundida: cae pareja y se apoya abajo */
  triste: [150, 216, 174, 180, 200, 210, 226, 180, 250, 216],
  /** Torcida y apretada: una mueca, no una pena. La asimetría es lo que
   *  la separa de `triste`, que cae pareja hacia los dos lados. */
  frustrado: [148, 206, 174, 184, 200, 200, 226, 176, 252, 194],
  /** Chica y recogida, como conteniendo el aire */
  sorprendido: [164, 180, 180, 204, 200, 186, 220, 204, 236, 180],
  /** Tranquila, con un extremo levantado: algo se está masticando */
  pensando: [148, 182, 174, 204, 200, 186, 226, 198, 252, 172],
  /** Despareja de verdad: cada valle a distinta profundidad */
  confundido: [148, 178, 172, 214, 200, 188, 228, 200, 252, 194],
  /** Casi una línea: la luz está apagada */
  dormido: [152, 194, 176, 200, 200, 196, 224, 200, 248, 194],
} as const satisfies Record<string, FaceShape>;

/** Mezcla dos caras punto por punto. t = 0 devuelve `a`, t = 1 devuelve `b`. */
export const mixFace = (a: FaceShape, b: FaceShape, t: number): FaceShape =>
  a.map((v, i) => v + (b[i] - v) * t);

/** Convierte una cara en el atributo `d` de un path SVG. */
export const facePathData = (face: FaceShape): string =>
  `M ${face[0]} ${face[1]} L ${face[2]} ${face[3]} L ${face[4]} ${face[5]} L ${face[6]} ${face[7]} L ${face[8]} ${face[9]}`;

/**
 * Cómo se mueve una actitud cuando está en reposo.
 *
 * Todas las frecuencias son ciclos por loop y tienen que ser enteras: así el
 * último frame empalma con el primero y la animación se puede repetir sin
 * salto. Un 2 significa dos ciclos completos a lo largo del video.
 */
export type MoodMotion = {
  /** Cuánto flota, en unidades del viewBox */
  bobAmp: number;
  bobFreq: number;
  /** Cuánto aletean las orejas, en grados */
  earAmp: number;
  earFreq: number;
  /** Temblor nervioso del cuerpo, en grados */
  shakeAmp: number;
  shakeFreq: number;
};

/** Una actitud completa: la pose de base más su manera de moverse. */
export type Mood = {
  /** Cómo se llama en español, para las etiquetas */
  label: string;
  face: FaceShape;
  /** Grados de cada oreja. Positivo las cae hacia afuera, negativo las para. */
  ears: [number, number];
  squash: number;
  tilt: number;
  bob: number;
  glow: number;
  motion: MoodMotion;
};

const still: MoodMotion = {
  bobAmp: 3,
  bobFreq: 1,
  earAmp: 3,
  earFreq: 1,
  shakeAmp: 0,
  shakeFreq: 1,
};

export const moods = {
  neutral: {
    label: "Neutral",
    face: FACES.neutral,
    ears: [0, 0],
    squash: 0,
    tilt: 0,
    bob: 0,
    glow: 0.5,
    motion: { ...still, bobAmp: 6, bobFreq: 2, earAmp: 6, earFreq: 2 },
  },
  feliz: {
    label: "Feliz",
    face: FACES.feliz,
    ears: [-14, -14],
    squash: -0.1,
    tilt: 0,
    bob: -4,
    glow: 0.78,
    motion: { ...still, bobAmp: 9, bobFreq: 2, earAmp: 9, earFreq: 2 },
  },
  emocionado: {
    label: "Emocionado",
    face: FACES.emocionado,
    ears: [-20, -20],
    squash: -0.18,
    tilt: 0,
    bob: -7,
    glow: 1,
    motion: { ...still, bobAmp: 13, bobFreq: 4, earAmp: 15, earFreq: 4 },
  },
  triste: {
    label: "Triste",
    face: FACES.triste,
    ears: [32, 32],
    squash: 0.32,
    tilt: 0,
    bob: 8,
    glow: 0.16,
    motion: { ...still, bobAmp: 3, bobFreq: 1, earAmp: 2, earFreq: 1 },
  },
  frustrado: {
    label: "Frustrado",
    face: FACES.frustrado,
    // Pegadas hacia atrás y disparejas, como un gato molesto
    ears: [30, 16],
    squash: 0.22,
    tilt: -5,
    bob: 2,
    glow: 0.58,
    motion: {
      bobAmp: 2,
      bobFreq: 2,
      earAmp: 4,
      earFreq: 6,
      shakeAmp: 2.6,
      shakeFreq: 8,
    },
  },
  sorprendido: {
    label: "Sorprendido",
    face: FACES.sorprendido,
    ears: [-24, -24],
    squash: -0.42,
    tilt: 0,
    bob: -9,
    glow: 0.92,
    motion: { ...still, bobAmp: 2, bobFreq: 1, earAmp: 3, earFreq: 2 },
  },
  pensando: {
    label: "Pensando",
    face: FACES.pensando,
    ears: [-14, 4],
    squash: 0.05,
    tilt: -9,
    bob: 0,
    glow: 0.45,
    motion: { ...still, bobAmp: 3, bobFreq: 1, earAmp: 6, earFreq: 2 },
  },
  confundido: {
    label: "Confundido",
    face: FACES.confundido,
    // Una parada y la otra caída: es lo que se lee al instante como "no entiendo"
    ears: [-26, 28],
    squash: 0.06,
    tilt: 9,
    bob: 0,
    glow: 0.4,
    motion: {
      bobAmp: 3,
      bobFreq: 1,
      earAmp: 7,
      earFreq: 3,
      shakeAmp: 1,
      shakeFreq: 3,
    },
  },
  dormido: {
    label: "Dormido",
    face: FACES.dormido,
    ears: [32, 30],
    squash: 0.36,
    tilt: 6,
    bob: 9,
    glow: 0.04,
    motion: { ...still, bobAmp: 5, bobFreq: 1, earAmp: 2, earFreq: 1 },
  },
} as const satisfies Record<string, Mood>;

export type MoodName = keyof typeof moods;

export const moodNames = Object.keys(moods) as MoodName[];
