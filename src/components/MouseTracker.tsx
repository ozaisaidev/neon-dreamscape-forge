
import React, { useEffect, useRef, useCallback } from 'react';

const MouseTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]); 
  const mouseRef = useRef({ x: undefined as number | undefined, y: undefined as number | undefined });
  const animationFrameIdRef = useRef<number | null>(null);

  // --- Configuration ---
  const PARTICLE_COUNT = 350;
  const PARTICLE_BASE_SIZE = 40;
  const PARTICLE_SIZE_VARIATION = 25;
  const MOUSE_RADIUS = 80;
  const REPULSION_STRENGTH = 5;
  const RETURN_SPEED = 0.03;
  const FRICTION = 0.92;
  const INITIAL_SPREAD_X_FACTOR = 0.8;
  const INITIAL_SPREAD_Y_FACTOR = 0.4;
  const INITIAL_Y_OFFSET = 0.55;
  const CANVAS_CLEAR_OPACITY = 0.1;
  const BACKGROUND_COLOR_RGBA = 'rgba(15, 14, 23)';

  // Define Particle class
  class Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    opacity: number;
    vx: number;
    vy: number;
    density: number;

    constructor(x: number, y: number, canvasWidth: number, canvasHeight: number) {
      this.baseX = x;
      this.baseY = y;
      this.x = x + (Math.random() - 0.5) * 20;
      this.y = y + (Math.random() - 0.5) * 20;
      const baseSize = PARTICLE_BASE_SIZE + (Math.random() * 2 - 1) * PARTICLE_SIZE_VARIATION;
      this.size = Math.max(10, baseSize);
      this.opacity = Math.random() * 0.3 + 0.15;
      this.vx = 0;
      this.vy = 0;
      this.density = Math.random() * REPULSION_STRENGTH + 1;
    }

    update(mouseX: number | undefined, mouseY: number | undefined) {
      let forceX = 0;
      let forceY = 0;

      if (mouseX !== undefined && mouseY !== undefined) {
        const dxMouse = this.x - mouseX;
        const dyMouse = this.y - mouseY;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < MOUSE_RADIUS) {
          const angle = Math.atan2(dyMouse, dxMouse);
          const force = (MOUSE_RADIUS - distMouse) / MOUSE_RADIUS;
          forceX += Math.cos(angle) * force * this.density;
          forceY += Math.sin(angle) * force * this.density;
        }
      }

      const dxBase = this.baseX - this.x;
      const dyBase = this.baseY - this.y;
      forceX += dxBase * RETURN_SPEED;
      forceY += dyBase * RETURN_SPEED;

      this.vx += forceX;
      this.vy += forceY;
      this.vx *= FRICTION;
      this.vy *= FRICTION;
      this.x += this.vx;
      this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D) {
      const drawOpacity = this.opacity;
      ctx.save();
      const radius = Math.max(0, this.size / 2);
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);

      gradient.addColorStop(0, `rgba(180, 180, 190, ${drawOpacity * 0.6})`);
      gradient.addColorStop(0.4, `rgba(150, 150, 160, ${drawOpacity * 0.3})`);
      gradient.addColorStop(1, `rgba(120, 120, 130, 0)`);

      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    particlesRef.current = [];
    const centerX = canvas.width / 2;
    const zoneWidth = canvas.width * INITIAL_SPREAD_X_FACTOR;
    const startX = centerX - zoneWidth / 2;

    const centerY = canvas.height * INITIAL_Y_OFFSET;
    const zoneHeight = canvas.height * INITIAL_SPREAD_Y_FACTOR;
    const startY = centerY - zoneHeight / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseX = startX + Math.random() * zoneWidth;
      const randomYFactor = Math.pow(Math.random(), 1.5);
      const baseY = startY + randomYFactor * zoneHeight;
      particlesRef.current.push(new Particle(baseX, baseY, canvas.width, canvas.height));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };
    setCanvasSize();

    const resizeTimeoutRef = { current: null as number | null };
    const handleResize = () => {
      if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = window.setTimeout(setCanvasSize, 200);
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
        mouseRef.current.x = undefined;
        mouseRef.current.y = undefined;
        return;
      }

      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = undefined;
      mouseRef.current.y = undefined;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `${BACKGROUND_COLOR_RGBA}, ${CANVAS_CLEAR_OPACITY})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        p.update(mouseRef.current.x, mouseRef.current.y);
        p.draw(ctx);
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto"
      style={{ backgroundColor: BACKGROUND_COLOR_RGBA }}
    />
  );
};

export default MouseTracker;
