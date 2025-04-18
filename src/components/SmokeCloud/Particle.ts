
import { SMOKE_CONFIG } from './constants';

export class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  pushForce: number;

  constructor(x: number, y: number) {
    this.baseX = x;
    this.baseY = y;
    this.x = x + (Math.random() - 0.5) * 5;
    this.y = y + (Math.random() - 0.5) * 5;
    this.size = Math.max(0.5, SMOKE_CONFIG.PARTICLE_BASE_SIZE + (Math.random() * 2 - 1) * SMOKE_CONFIG.PARTICLE_SIZE_VARIATION);
    this.opacity = Math.max(0.01, SMOKE_CONFIG.PARTICLE_BASE_OPACITY + (Math.random() * 2 - 1) * SMOKE_CONFIG.PARTICLE_OPACITY_VARIATION);
    this.vx = (Math.random() - 0.5) * SMOKE_CONFIG.INHERENT_DRIFT_SPEED * 0.2;
    this.vy = (Math.random() - 0.5) * SMOKE_CONFIG.INHERENT_DRIFT_SPEED * 0.2;
    this.pushForce = (Math.random() * 0.5 + 0.5) * SMOKE_CONFIG.REPULSION_STRENGTH;
  }

  update(mouseX: number | undefined, mouseY: number | undefined) {
    let forceX = 0;
    let forceY = 0;

    if (mouseX !== undefined && mouseY !== undefined) {
      const dxMouse = this.x - mouseX;
      const dyMouse = this.y - mouseY;
      const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;
      const mouseRadiusSq = SMOKE_CONFIG.MOUSE_RADIUS * SMOKE_CONFIG.MOUSE_RADIUS;

      if (distSqMouse < mouseRadiusSq) {
        const distMouse = Math.sqrt(distSqMouse);
        const angle = Math.atan2(dyMouse, dxMouse);
        const forceFactor = (SMOKE_CONFIG.MOUSE_RADIUS - distMouse) / SMOKE_CONFIG.MOUSE_RADIUS;
        forceX += Math.cos(angle) * forceFactor * this.pushForce;
        forceY += Math.sin(angle) * forceFactor * this.pushForce;
      }
    }

    const dxBase = this.baseX - this.x;
    const dyBase = this.baseY - this.y;
    forceX += dxBase * SMOKE_CONFIG.RETURN_SPEED;
    forceY += dyBase * SMOKE_CONFIG.RETURN_SPEED;

    forceX += (Math.random() - 0.5) * SMOKE_CONFIG.INHERENT_DRIFT_SPEED;
    forceY += (Math.random() - 0.5) * SMOKE_CONFIG.INHERENT_DRIFT_SPEED;

    this.vx += forceX;
    this.vy += forceY;

    this.vx *= SMOKE_CONFIG.FRICTION;
    this.vy *= SMOKE_CONFIG.FRICTION;

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > SMOKE_CONFIG.MAX_VELOCITY) {
      const factor = SMOKE_CONFIG.MAX_VELOCITY / speed;
      this.vx *= factor;
      this.vy *= factor;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const [r, g, b] = SMOKE_CONFIG.PARTICLE_COLOR;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
