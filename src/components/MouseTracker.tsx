import React, { useEffect, useRef, useCallback } from 'react';

const MouseTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]); // Store particles in a ref
  const mouseRef = useRef({ x: -200, y: -200 }); // Start mouse off-screen
  const isMouseMovingRef = useRef(false);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameIdRef = useRef<number | null>(null); // To cancel animation frame

  // --- Configuration ---
  const PARTICLE_COUNT_PER_MOVE = 4;  // How many particles per frame when moving
  const PARTICLE_BASE_SIZE = 25;      // Base size (will vary)
  const PARTICLE_SIZE_VARIATION = 15; // How much size can vary (+/-)
  const PARTICLE_LIFESPAN_DECAY = 0.018;// How fast particles fade/shrink (lower = longer)
  const PARTICLE_DRIFT_X = 0.5;       // Max horizontal drift speed
  const PARTICLE_DRIFT_Y = -0.8;      // Max vertical drift speed (negative for upward)
  const CANVAS_CLEAR_OPACITY = 0.15;  // How much old frames linger (0=clear, 1=never clear)
  const BACKGROUND_COLOR_RGBA = 'rgba(15, 14, 23)'; // Match your desired background for clearing

  // Define Particle class
  class Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    vx: number;
    vy: number;
    decay: number;
    initialSize: number;

    constructor(x: number, y: number) {
      this.x = x + (Math.random() - 0.5) * 10; // Add slight position offset
      this.y = y + (Math.random() - 0.5) * 10;
      const baseSize = PARTICLE_BASE_SIZE + (Math.random() * 2 - 1) * PARTICLE_SIZE_VARIATION;
      this.size = Math.max(5, baseSize); // Ensure minimum size
      this.initialSize = this.size;
      this.opacity = 0.8 + Math.random() * 0.2; // Start slightly varied opacity
      this.vx = (Math.random() - 0.5) * PARTICLE_DRIFT_X * 2; // Horizontal velocity
      this.vy = Math.random() * PARTICLE_DRIFT_Y - 0.2;       // Vertical velocity (mostly up)
      this.decay = PARTICLE_LIFESPAN_DECAY * (0.8 + Math.random() * 0.4); // Vary lifespan slightly
    }

    update() {
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Update opacity and size
      this.opacity -= this.decay;
      // Shrink based on decay - adjust multiplier as needed
      this.size -= this.decay * (this.initialSize * 0.4);
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (this.opacity <= 0 || this.size <= 1) return; // Don't draw if invisible/tiny

      ctx.save(); // Save context state

      // Create radial gradient for soft smoke effect
      const radius = Math.max(0, this.size / 2);
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);

      // Adjust color/alpha - start whiter, fade to grey/transparent
      const alpha = Math.max(0, this.opacity); // Ensure alpha doesn't go negative
      gradient.addColorStop(0, `rgba(220, 220, 235, ${alpha * 0.8})`); // Center (slightly whiter/blueish)
      gradient.addColorStop(0.5, `rgba(200, 200, 210, ${alpha * 0.5})`); // Mid
      gradient.addColorStop(1, `rgba(180, 180, 190, 0)`);     // Outer edge (transparent grey)

      ctx.fillStyle = gradient;
      // Using 'lighter' can create a nice glow effect as particles overlap
      ctx.globalCompositeOperation = 'lighter';

      // Draw the circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Restore context state (includes globalCompositeOperation)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    particlesRef.current = [];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    // Declare resizeTimeout with proper typing
    let resizeTimeout: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
        particlesRef.current = [];
      }, 200);
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
        let clientX: number, clientY: number;
        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else if (event.touches && event.touches.length > 0) {
             // Prevent scroll/refresh on touch devices within canvas
            event.preventDefault();
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            return; // No position data
        }

        mouseRef.current.x = clientX;
        mouseRef.current.y = clientY;
        isMouseMovingRef.current = true;

        // Reset flag after a short delay if mouse stops
        if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current);
        mouseMoveTimeoutRef.current = setTimeout(() => {
            isMouseMovingRef.current = false;
        }, 100); // Reset after 100ms of no movement
    };

    const handleMouseOut = () => {
        mouseRef.current.x = -200; // Move logically off-screen
        mouseRef.current.y = -200;
        isMouseMovingRef.current = false;
    };

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleMouseMove, { passive: false });
    canvas.addEventListener('touchstart', handleMouseMove, { passive: false });
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      // 1. Clear canvas (with fade effect)
      // Reset composite operation before clearing
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `${BACKGROUND_COLOR_RGBA}, ${CANVAS_CLEAR_OPACITY})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Create new particles if mouse is moving
      if (isMouseMovingRef.current) {
        for (let i = 0; i < PARTICLE_COUNT_PER_MOVE; i++) {
          particlesRef.current.push(new Particle(mouseRef.current.x, mouseRef.current.y));
        }
      }

      // 3. Update and draw particles (iterate backwards for safe removal)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update();

        // Remove particle if faded or too small
        if (p.opacity <= 0 || p.size <= 1) {
          particlesRef.current.splice(i, 1);
        } else {
          p.draw(ctx); // Pass context to draw method
        }
      }

      // Request next frame
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [PARTICLE_COUNT_PER_MOVE, PARTICLE_BASE_SIZE, PARTICLE_SIZE_VARIATION, 
      PARTICLE_LIFESPAN_DECAY, PARTICLE_DRIFT_X, PARTICLE_DRIFT_Y, 
      CANVAS_CLEAR_OPACITY, BACKGROUND_COLOR_RGBA]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto bg-[rgb(15,14,23)]"
      style={{ cursor: 'none' }}
    />
  );
};

export default MouseTracker;
