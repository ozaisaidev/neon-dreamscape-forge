
import { useCallback } from 'react';
import { Particle } from './Particle';
import { SMOKE_CONFIG } from './constants';

export const useSmokeSystem = () => {
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const cloudWidth = canvas.width * SMOKE_CONFIG.CLOUD_WIDTH_FACTOR;
    const cloudHeight = canvas.height * SMOKE_CONFIG.CLOUD_HEIGHT_FACTOR;
    const startX = (canvas.width * SMOKE_CONFIG.CLOUD_CENTER_X_FACTOR) - (cloudWidth / 2);
    const startY = (canvas.height * SMOKE_CONFIG.CLOUD_CENTER_Y_FACTOR) - (cloudHeight / 2);

    for (let i = 0; i < SMOKE_CONFIG.PARTICLE_COUNT; i++) {
      const baseX = startX + Math.random() * cloudWidth;
      const baseY = startY + Math.random() * cloudHeight;
      particles.push(new Particle(baseX, baseY));
    }
    return particles;
  }, []);

  return { initParticles };
};
