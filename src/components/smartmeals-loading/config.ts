// Single source of truth for the SmartMeals loading animation.
// Tweak copy, timing and geometry here; components read from this file only.

export const LOADING_STEPS = [
  "Logging you into SmartMeals",
  "Linking to your HARPS loyalty",
  "Personalizing for you",
] as const;

/** Milliseconds. One loop = steps × (fill + hold) + reset. */
export const TIMING = {
  /** Ring sweeps one step's share of the circle. */
  fill: 1600,
  /** Ring rests after each step before the next label appears. */
  hold: 800,
  /** After the last step, the navy fill fades out and the loop restarts. */
  reset: 500,
};

/**
 * Ring geometry in Figma units (node 581:810). The SVG uses this as its viewBox,
 * so the ring scales to whatever width the container gives it.
 */
export const RING = {
  size: 334,
  stroke: 7.34,
  /** Inner dotted track (Figma "Repeat group 1"). */
  dots: {
    count: 22,
    radius: 147,
    diameter: 5,
    /** Angle of the first dot, in degrees, where -90 is 12 o'clock. */
    startDeg: -96.3,
    /** The middle dot of each step's arc becomes a checkmark (Figma node 582:898) when filled. */
    checkSize: 20,
  },
};

/** Fill sweeps clockwise from 12 o'clock. */
export const DIRECTION = "clockwise" as "clockwise" | "counterclockwise";
