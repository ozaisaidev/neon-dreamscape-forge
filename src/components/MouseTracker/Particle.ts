
import { PARTICLE_CONFIG } from './constants';

export class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  density: number;

  constructor(x: number, y: number) {
    const { PARTICLE_BASE_SIZE, PARTICLE_SIZE_VARIATION, INHERENT_DRIFT, REPULSION_STRENGTH } = PARTICLE_CONFIG;
    
    this.baseX = x;
    this.baseY = y;
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    const baseSize = PARTICLE_BASE_SIZE + Math.random() * PARTICLE_SIZE_VARIATION;
    this.size = Math.max(1, baseSize);
    this.opacity = Math.random() * 0.1 + 0.03;
    this.vx = (Math.random() - 0.5) * INHERENT_DRIFT * 0.5;
    this.vy = (Math.random() - 0.5) * INHERENT_DRIFT * 0.5;
    this.density = Math.random() * REPULSION_STRENGTH + 0.5;
  }

  update(mouseX: number | undefined, mouseY: number | undefined) {
    const { MOUSE_RADIUS, RETURN_SPEED, FRICTION, INHERENT_DRIFT, MAX_VELOCITY } = PARTICLE_CONFIG;
    
    let forceX = 0;
    let forceY = 0;

    if (mouseX !== undefined && mouseY !== undefined) {
      const dxMouse = this.x - mouseX;
      const dyMouse = this.y - mouseY;
      const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;
      const mouseRadiusSq = MOUSE_RADIUS * MOUSE_RADIUS;

      if (distSqMouse < mouseRadiusSq) {
        const distMouse = Math.sqrt(distSqMouse);
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

    forceX += (Math.random() - 0.5) * INHERENT_DRIFT;
    forceY += (Math.random() - 0.5) * INHERENT_DRIFT;

    this.vx += forceX;
    this.vy += forceY;

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, this.vx));
    this.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, this.vy));

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const drawOpacity = this.opacity;

    ctx.save();
    const radius = Math.max(0, this.size / 2);
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);

    gradient.addColorStop(0, `rgba(210, 210, 225, ${drawOpacity * 0.8})`);
    gradient.addColorStop(0.5, `rgba(190, 190, 200, ${drawOpacity * 0.4})`);
    gradient.addColorStop(1, `rgba(170, 170, 180, 0)`);

    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'lighter';

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
