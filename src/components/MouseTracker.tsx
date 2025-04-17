
import React, { useEffect, useRef } from 'react';

const MouseTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      lifespan: number;
      maxLifespan: number;

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * size + 1;
        this.color = color;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.maxLifespan = 150;
        this.lifespan = this.maxLifespan;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.lifespan -= 1;
        
        if (this.size > 0.2) this.size -= 0.05;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = this.lifespan / this.maxLifespan;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Dust cloud particles
    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMouseMoving = false;
    
    // More subtle, professional colors for dust particles
    const colors = ['rgba(155, 135, 245, 0.6)', 'rgba(214, 188, 250, 0.6)']; // Subtle purple tones

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      
      // Calculate mouse speed for splash effect
      const mouseSpeed = Math.sqrt(
        Math.pow(mouseX - lastMouseX, 2) + 
        Math.pow(mouseY - lastMouseY, 2)
      );
      
      // Create particles based on mouse speed (more subtle)
      const particleCount = Math.min(3 + Math.floor(mouseSpeed / 3), 8);
      
      for (let i = 0; i < particleCount; i++) {
        // Add variation to particle position
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        
        particles.push(
          new Particle(
            mouseX + offsetX, 
            mouseY + offsetY, 
            Math.random() * 3 + 1,
            colors[Math.floor(Math.random() * colors.length)]
          )
        );
      }
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    // Create initial dust cloud (more subtle)
    const createInitialDustCloud = () => {
      const particleCount = 80;
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push(new Particle(x, y, size, color));
        
        // Make initial particles more stable
        particles[i].speedX = (Math.random() - 0.5) * 0.3;
        particles[i].speedY = (Math.random() - 0.5) * 0.3;
        particles[i].lifespan = 300 + Math.random() * 200;
        particles[i].maxLifespan = particles[i].lifespan;
      }
    };

    createInitialDustCloud();
    
    // Animation loop
    const animate = () => {
      // Clear canvas with slight fade for trail effect
      ctx.fillStyle = 'rgba(15, 14, 23, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
        
        // Remove dead particles
        if (particles[i].lifespan <= 0 || particles[i].size <= 0.2) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Add new ambient particles occasionally (less frequently)
      if (particles.length < 60 && Math.random() > 0.98) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(
          new Particle(
            x, 
            y, 
            Math.random() * 2 + 1,
            colors[Math.floor(Math.random() * colors.length)]
          )
        );
      }
      
      isMouseMoving = false;
      requestAnimationFrame(animate);
    };

    // Set up event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto"
    />
  );
};

export default MouseTracker;
