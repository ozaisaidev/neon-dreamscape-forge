
import React, { useEffect, useRef } from 'react';

const MouseTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSmoke(); // Re-initialize smoke when resizing
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Smoke settings
    let particles: Particle[] = [];
    const particleCount = 700; // More particles for denser smoke
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 100; // Area of influence around the mouse

    // Gradient colors for the smoke
    const blueGradient = ctx.createLinearGradient(0, 0, canvas.width / 2, canvas.height);
    blueGradient.addColorStop(0, 'rgba(41, 72, 135, 0)');
    blueGradient.addColorStop(0.5, 'rgba(50, 87, 164, 0.6)');
    blueGradient.addColorStop(1, 'rgba(33, 58, 108, 0)');

    const redGradient = ctx.createLinearGradient(canvas.width / 2, 0, canvas.width, canvas.height);
    redGradient.addColorStop(0, 'rgba(135, 41, 66, 0)');
    redGradient.addColorStop(0.5, 'rgba(164, 50, 78, 0.6)');
    redGradient.addColorStop(1, 'rgba(108, 33, 54, 0)');

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      gradient: CanvasGradient;
      opacity: number;
      vx: number;
      vy: number;
      friction: number;
      ease: number;

      constructor(x: number, y: number, size: number, gradient: CanvasGradient) {
        this.x = x;
        this.y = y;
        this.baseX = x; // Original position to return to
        this.baseY = y;
        this.size = Math.random() * size + size / 2;
        this.density = (Math.random() * 10) + 2;
        this.gradient = gradient;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.95; // Slows down movement
        this.ease = 0.04 * Math.random() + 0.02; // How fast it returns to original position
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Create a radial gradient for each particle for a softer look
        const particleGradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        particleGradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        particleGradient.addColorStop(0.5, `rgba(200, 200, 200, ${this.opacity * 0.5})`);
        particleGradient.addColorStop(1, `rgba(150, 150, 150, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.globalCompositeOperation = 'screen';
        ctx.fill();
      }

      update() {
        // Calculate distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Movement based on mouse position
        if (distance < mouseRadius) {
          // Calculate angle
          const angle = Math.atan2(dy, dx);
          const force = (mouseRadius - distance) / mouseRadius;
          
          // Push particle away from mouse
          this.vx -= Math.cos(angle) * force * this.density;
          this.vy -= Math.sin(angle) * force * this.density;
        }
        
        // Apply velocity with friction
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Return to original position
        const dx2 = this.baseX - this.x;
        const dy2 = this.baseY - this.y;
        this.x += dx2 * this.ease;
        this.y += dy2 * this.ease;
      }
    }

    // Initialize smoke particles
    function initSmoke() {
      particles = [];
      
      // Left side smoke (blue-ish)
      const leftCloud = {
        x: canvas.width * 0.3,
        y: canvas.height * 0.5,
        width: canvas.width * 0.4,
        height: canvas.height * 0.7
      };
      
      // Right side smoke (red-ish)
      const rightCloud = {
        x: canvas.width * 0.6,
        y: canvas.height * 0.5,
        width: canvas.width * 0.4,
        height: canvas.height * 0.7
      };
      
      for (let i = 0; i < particleCount / 2; i++) {
        // Random position within left cloud using gaussian distribution
        const radius = Math.sqrt(-2 * Math.log(Math.random()));
        const theta = 2 * Math.PI * Math.random();
        const xOffset = radius * Math.cos(theta) * leftCloud.width * 0.3;
        const yOffset = radius * Math.sin(theta) * leftCloud.height * 0.3;
        const x = leftCloud.x + xOffset;
        const y = leftCloud.y + yOffset;
        
        particles.push(new Particle(x, y, 20, blueGradient));
      }
      
      for (let i = 0; i < particleCount / 2; i++) {
        // Random position within right cloud using gaussian distribution
        const radius = Math.sqrt(-2 * Math.log(Math.random()));
        const theta = 2 * Math.PI * Math.random();
        const xOffset = radius * Math.cos(theta) * rightCloud.width * 0.3;
        const yOffset = radius * Math.sin(theta) * rightCloud.height * 0.3;
        const x = rightCloud.x + xOffset;
        const y = rightCloud.y + yOffset;
        
        particles.push(new Particle(x, y, 20, redGradient));
      }
    }

    initSmoke();

    // Mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      mouseX = event.touches[0].clientX;
      mouseY = event.touches[0].clientY;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Animation loop
    function animate() {
      // Create a subtle trail effect with semi-transparent clear
      ctx.fillStyle = 'rgba(15, 14, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      requestAnimationFrame(animate);
    }
    
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
