
export const BACKGROUND_COLOR = 'rgb(15, 14, 23)';

export const BLOB_CONFIG = [
  {
    color: [255, 80, 120],
    baseRadiusFactor: 0.4,
    positionFactor: { x: 0.25, y: 0.3 },
    speed: 0.005,
    repulsion: 4,
    returnForce: 0.02,
  },
  {
    color: [80, 80, 220],
    baseRadiusFactor: 0.45,
    positionFactor: { x: 0.75, y: 0.7 },
    speed: 0.006,
    repulsion: 5,
    returnForce: 0.02,
  },
] as const;

export const ANIMATION_CONFIG = {
  MOUSE_INFLUENCE_RADIUS: 150,
  FRICTION: 0.94,
  INHERENT_OSCILLATION_AMP: 50,
} as const;

export const lerp = (start: number, end: number, amount: number): number => {
  return start * (1 - amount) + end * amount;
};
