/**
 * Paleta y constantes de marca de Focoweb.
 * Los colores salen directamente del SVG original del logo.
 */
export const colors = {
  /** Fondo azul noche del isotipo */
  night: "#12172B",
  /** Relleno interior del vidrio de la ampolleta */
  glass: "#1D2440",
  /** Inicio del gradiente (amarillo cálido) */
  glowStart: "#FFD874",
  /** Fin del gradiente (naranja) */
  glowEnd: "#FF9F45",
  /** Color de halo para resplandores y sombras */
  halo: "#FFB855",
  white: "#FFFFFF",
  muted: "#8B93B0",
} as const;

/** Radio de esquina del isotipo, relativo al viewBox de 400x400 */
export const LOGO_VIEWBOX = 400;

export const fps = 30;
