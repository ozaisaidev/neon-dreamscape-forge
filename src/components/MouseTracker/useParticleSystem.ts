
import { useCallback } from 'react';
import { Particle } from './Particle';
import { PARTICLE_CONFIG, CLOUD_CONFIG } from './constants';

export const useParticleSystem = () => {
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const cloudWidth = canvas.width * CLOUD_CONFIG.WIDTH_FACTOR;
    const cloudHeight = canvas.height * CLOUD_CONFIG.HEIGHT_FACTOR;
    const startX = (canvas.width * CLOUD_CONFIG.CENTER_X_FACTOR) - (cloudWidth / 2);
    const startY = (canvas.height * CLOUD_CONFIG.CENTER_Y_FACTOR) - (cloudHeight / 2);

    for (let i = 0; i < PARTICLE_CONFIG.PARTICLE_COUNT; i++) {
      const xFactor = Math.random() * Math.random();
      const yFactor = Math.random() * Math.random();
      const xSign = Math.random() < 0.5 ? 1 : -1;
      const ySign = Math.random() < 0.5 ? 1 : -1;

      const baseX = startX + (cloudWidth / 2) + (xSign * xFactor * cloudWidth / 2);
      const baseY = startY + (cloudHeight / 2) + (ySign * yFactor * cloudHeight / 2);

      particles.push(new Particle(baseX, baseY));
    }
    
    return particles;
  }, []);

  return { initParticles };
};
