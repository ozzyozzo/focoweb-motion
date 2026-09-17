/**
 * Pequeñas utilidades de movimiento compartidas por las animaciones.
 */

type DecayOptions = {
  frame: number;
  fps: number;
  /** Frame en que empieza la sacudida */
  start: number;
  /** Oscilaciones por segundo */
  frequency: number;
  /** Segundos que tarda en reducirse a la mitad */
  halfLife: number;
};

/**
 * Oscilación que se va apagando, entre -1 y 1. Sirve para rebotes, sacudidas
 * y todo lo que deba temblar un momento y quedarse quieto.
 * Devuelve 0 antes de `start`, para poder encadenar gestos sin ensuciar.
 */
export const decay = ({
  frame,
  fps,
  start,
  frequency,
  halfLife,
}: DecayOptions): number => {
  const elapsed = (frame - start) / fps;
  if (elapsed < 0) {
    return 0;
  }
  const amplitude = Math.pow(0.5, elapsed / halfLife);
  return Math.sin(elapsed * frequency * Math.PI * 2) * amplitude;
};
