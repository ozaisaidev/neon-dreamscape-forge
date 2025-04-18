
import React, { useEffect, useRef } from 'react';
import { BACKGROUND_COLOR } from './constants';
import { useGradientSystem } from './useGradientSystem';
import type { Blob } from './Blob';

const GradientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationFrameIdRef = useRef<number | null>(null);
  const { initBlobs } = useGradientSystem();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      blobsRef.current = initBlobs(canvas);
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
      } else return;

      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleMouseLeave);

    const animate = (currentTime: number) => {
      const time = currentTime * 0.01;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';

      blobsRef.current.forEach(blob => {
        blob.update(mouseRef.current.x, mouseRef.current.y, time);
        blob.draw(ctx);
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
  }, [initBlobs]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ backgroundColor: BACKGROUND_COLOR }}
    />
  );
};

export default GradientBackground;
