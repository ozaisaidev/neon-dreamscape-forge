
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
      baseX: number;
      baseY: number;
      density: number;
      distance: number;

      constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 10) + 2;
        this.distance = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update(mouseX: number, mouseY: number) {
        // Calculate distance between particle and mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        const maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;
        
        const directionX = forceDirectionX * force * this.density * -1;
        const directionY = forceDirectionY * force * this.density * -1;
        
        if (distance < maxDistance) {
          this.x += directionX;
          this.y += directionY;
        } else {
          // Return to original position if not influenced by mouse
          if (this.x !== this.baseX) {
            const dx = this.baseX - this.x;
            this.x += dx / 10;
          }
          if (this.y !== this.baseY) {
            const dy = this.baseY - this.y;
            this.y += dy / 10;
          }
        }
      }
    }

    // Create dust clouds
    const createDustClouds = () => {
      const particles: Particle[] = [];
      const particleCount = 250;
      
      // First cloud - blue-ish tint (left side)
      const blueTints = ['rgba(147, 149, 255, 0.5)', 'rgba(164, 166, 255, 0.4)', 'rgba(184, 186, 255, 0.3)'];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        const x = (Math.random() * canvas.width * 0.4) + (canvas.width * 0.1);
        const y = (Math.random() * canvas.height * 0.7) + (canvas.height * 0.15);
        const color = blueTints[Math.floor(Math.random() * blueTints.length)];
        particles.push(new Particle(x, y, size, color));
      }
      
      // Second cloud - reddish tint (right side)
      const redTints = ['rgba(255, 111, 145, 0.5)', 'rgba(255, 130, 160, 0.4)', 'rgba(255, 150, 175, 0.3)'];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        const x = (Math.random() * canvas.width * 0.4) + (canvas.width * 0.5);
        const y = (Math.random() * canvas.height * 0.7) + (canvas.height * 0.15);
        const color = redTints[Math.floor(Math.random() * redTints.length)];
        particles.push(new Particle(x, y, size, color));
      }
      
      return particles;
    };

    const particles = createDustClouds();
    
    let mouseX = 0;
    let mouseY = 0;
    
    // Mouse event handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Touch event handler for mobile
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouseX, mouseY);
        particles[i].draw(ctx);
      }
      
      requestAnimationFrame(animate);
    };

    // Set up event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
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
