
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

    // Smoke particle class
    class SmokeParticle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      opacity: number;
      speedX: number;
      speedY: number;
      initialOpacity: number;

      constructor(x: number, y: number, size: number, color: string, opacity: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.color = color;
        this.opacity = opacity;
        this.initialOpacity = opacity;
        this.speedX = 0;
        this.speedY = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('opacity', this.opacity.toString());
        ctx.fill();
      }

      update(mouseX: number, mouseY: number) {
        // Distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Mouse influence area
        const mouseRadius = 120;
        
        if (distance < mouseRadius) {
          // Pushing force - stronger when closer to the mouse
          const pushFactor = (1 - distance / mouseRadius) * 15;
          
          // Direction away from mouse
          const angle = Math.atan2(dy, dx);
          
          // Apply pushing force
          this.speedX = -Math.cos(angle) * pushFactor;
          this.speedY = -Math.sin(angle) * pushFactor;
          
          // Reduce opacity to create the "dispersing" effect
          this.opacity = Math.max(0.1, this.opacity - 0.05);
        } else {
          // Return slowly to original position
          this.speedX *= 0.9;
          this.speedY *= 0.9;
          
          // Gradually return to original opacity
          if (this.opacity < this.initialOpacity) {
            this.opacity += 0.01;
          }
          
          // Return to original position
          const homeX = this.baseX - this.x;
          const homeY = this.baseY - this.y;
          this.speedX += homeX * 0.03;
          this.speedY += homeY * 0.03;
        }
        
        // Apply speed
        this.x += this.speedX;
        this.y += this.speedY;
      }
    }

    // Create smoke areas
    const createSmoke = () => {
      const particles: SmokeParticle[] = [];
      
      // First smoke cloud - left side (blue-ish)
      const blueSmoke = 'rgba(180, 200, 255, opacity)';
      const leftCloudCenter = { x: canvas.width * 0.3, y: canvas.height * 0.5 };
      const leftCloudRadius = Math.min(canvas.width, canvas.height) * 0.2;
      
      for (let i = 0; i < 200; i++) {
        // Random position within cloud area using gaussian-like distribution
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * leftCloudRadius;
        const x = leftCloudCenter.x + Math.cos(angle) * radius;
        const y = leftCloudCenter.y + Math.sin(angle) * radius;
        
        // Random size and opacity
        const size = Math.random() * 15 + 5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particles.push(new SmokeParticle(x, y, size, blueSmoke, opacity));
      }
      
      // Second smoke cloud - right side (red-ish)
      const redSmoke = 'rgba(255, 180, 180, opacity)';
      const rightCloudCenter = { x: canvas.width * 0.7, y: canvas.height * 0.5 };
      const rightCloudRadius = Math.min(canvas.width, canvas.height) * 0.2;
      
      for (let i = 0; i < 200; i++) {
        // Random position within cloud area
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * rightCloudRadius;
        const x = rightCloudCenter.x + Math.cos(angle) * radius;
        const y = rightCloudCenter.y + Math.sin(angle) * radius;
        
        // Random size and opacity
        const size = Math.random() * 15 + 5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particles.push(new SmokeParticle(x, y, size, redSmoke, opacity));
      }
      
      return particles;
    };

    const particles = createSmoke();
    
    let mouseX = -100;
    let mouseY = -100;
    
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
      // Semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(15, 14, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
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
