
import React, { useEffect, useRef } from 'react';
import { useSmokeSystem } from './useSmokeSystem';
import { SMOKE_CONFIG } from './constants';
import type { Particle } from './Particle';

const SmokeCloud: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: undefined as number | undefined, y: undefined as number | undefined });
  const animationFrameIdRef = useRef<number | null>(null);
  const { initParticles } = useSmokeSystem();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
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

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = undefined;
      mouseRef.current.y = undefined;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `${SMOKE_CONFIG.BACKGROUND_COLOR_RGBA}, ${SMOKE_CONFIG.CANVAS_CLEAR_OPACITY})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';

      particlesRef.current.forEach(p => {
        p.update(mouseRef.current.x, mouseRef.current.y);
        p.draw(ctx);
      });
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto"
      style={{ backgroundColor: SMOKE_CONFIG.BACKGROUND_COLOR_RGBA, touchAction: 'none' }}
    />
  );
};

export default SmokeCloud;
