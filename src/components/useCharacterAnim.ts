import type { LogoAnim } from "./FocowebLogo";
import { FACES, mixFace } from "./expressions";

/**
 * Parámetros del personaje en reposo. Son amplitudes, así que subirlos
 * exagera el gesto y bajarlos lo vuelve más contenido.
 */
export const character = {
  /** Cuánto flota, en unidades del viewBox */
  bob: 7,
  /** Cuánto se aplasta al caer, de 0 a 1 */
  squash: 0.3,
  /** Grados de vaivén del cuerpo */
  sway: 3.5,
  /** Grados de aleteo de las orejas */
  earFlap: 7,
  /** Grados de asimetría entre una oreja y la otra */
  earOffset: 3,
  /** Retardo de las orejas respecto del cuerpo, en radianes */
  earLag: 0.55,
  /** Qué tan sonriente queda la cara en promedio, de -1 a 1 */
  smile: 0.25,
} as const;

type Options = {
  frame: number;
  durationInFrames: number;
  withBackground?: boolean;
};

/**
 * Ciclo de reposo del personaje: flota, se aplasta al caer, se balancea y
 * mueve las orejas.
 *
 * Todo se calcula sobre una sola fase que recorre exactamente una vuelta
 * completa a lo largo de la composición. Como cada término es un múltiplo
 * entero de esa fase, el último frame empalma con el primero y el loop no
 * tiene salto. Si agregas movimiento nuevo, mantén esa regla.
 */
export const useCharacterAnim = ({
  frame,
  durationInFrames,
  withBackground = true,
}: Options): LogoAnim => {
  const phase = (frame / durationInFrames) * Math.PI * 2;

  // Dos flotadas por loop. Negativo es hacia arriba.
  const bob = -character.bob * Math.sin(2 * phase);

  // Se estira mientras sube y se aplasta al llegar abajo.
  const squash = -character.squash * Math.sin(2 * phase);

  // Un vaivén lento, una vuelta por loop.
  const tilt = character.sway * Math.sin(phase);

  // Las orejas siguen al cuerpo con retardo, y nunca del todo iguales.
  const flap = character.earFlap * Math.sin(2 * phase - character.earLag);
  const offset = character.earOffset * Math.sin(phase);

  const face = mixFace(
    FACES.neutral,
    FACES.feliz,
    character.smile + 0.2 * Math.sin(2 * phase - 0.6),
  );

  return {
    bodyScale: 1,
    bodyOpacity: 1,
    filament: 1,
    glow: 0.5 + 0.12 * Math.sin(2 * phase),
    ears: [1, 1],
    flash: 0,
    background: withBackground ? 1 : 0,
    earTilt: [flap + offset, flap - offset],
    squash,
    tilt,
    bob,
    face,
  };
};
