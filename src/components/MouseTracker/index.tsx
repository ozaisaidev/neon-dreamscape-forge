
import React, { useEffect, useRef } from 'react';
import { useParticleSystem } from './useParticleSystem';
import { CANVAS_CONFIG } from './constants';
import type { Particle } from './Particle';

const MouseTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: undefined as number | undefined, y: undefined as number | undefined });
  const animationFrameIdRef = useRef<number | null>(null);
  const { initParticles } = useParticleSystem();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas);
    };
    
    setCanvasSize();

    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(setCanvasSize, 200);
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        mouseRef.current = { x: undefined, y: undefined };
        return;
      }

      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: undefined, y: undefined };
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleMouseLeave);

    const animate = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `${CANVAS_CONFIG.BACKGROUND_COLOR}, ${CANVAS_CONFIG.CLEAR_OPACITY})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.update(mouseRef.current.x, mouseRef.current.y);
        particle.draw(ctx);
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchend', handleMouseLeave);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto"
      style={{ backgroundColor: CANVAS_CONFIG.BACKGROUND_COLOR }}
    />
  );
};

export default MouseTracker;
