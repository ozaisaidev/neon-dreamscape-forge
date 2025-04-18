
import { ANIMATION_CONFIG } from './constants';

export class Blob {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  radius: number;
  baseRadiusFactor: number;
  color: number[];
  speed: number;
  repulsion: number;
  returnForce: number;
  positionFactor: { x: number; y: number };
  oscillationOffset: number;

  constructor(config: {
    color: number[];
    baseRadiusFactor: number;
    positionFactor: { x: number; y: number };
    speed: number;
    repulsion: number;
    returnForce: number;
  }, canvasWidth: number, canvasHeight: number) {
    this.baseRadiusFactor = config.baseRadiusFactor;
    this.color = config.color;
    this.speed = config.speed;
    this.repulsion = config.repulsion;
    this.returnForce = config.returnForce;
    this.positionFactor = config.positionFactor;
    this.oscillationOffset = Math.random() * Math.PI * 2;

    this.updateBasePositionAndRadius(canvasWidth, canvasHeight);
    this.x = this.baseX;
    this.y = this.baseY;
  }

  updateBasePositionAndRadius(canvasWidth: number, canvasHeight: number) {
    const smallerDimension = Math.min(canvasWidth, canvasHeight);
    this.radius = smallerDimension * this.baseRadiusFactor;
    this.baseX = canvasWidth * this.positionFactor.x;
    this.baseY = canvasHeight * this.positionFactor.y;
  }

  update(mouseX: number | undefined, mouseY: number | undefined, time: number) {
    let forceX = 0;
    let forceY = 0;

    const targetX = this.baseX + Math.sin(time * this.speed + this.oscillationOffset) * ANIMATION_CONFIG.INHERENT_OSCILLATION_AMP;
    const targetY = this.baseY + Math.cos(time * this.speed * 1.2 + this.oscillationOffset) * ANIMATION_CONFIG.INHERENT_OSCILLATION_AMP;

    if (mouseX !== undefined && mouseY !== undefined) {
      const dxMouse = this.x - mouseX;
      const dyMouse = this.y - mouseY;
      const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;
      const influenceRadiusSq = ANIMATION_CONFIG.MOUSE_INFLUENCE_RADIUS * ANIMATION_CONFIG.MOUSE_INFLUENCE_RADIUS;

      if (distSqMouse < influenceRadiusSq * (this.radius * 0.5)) {
        const distMouse = Math.sqrt(distSqMouse);
        const angle = Math.atan2(dyMouse, dxMouse);
        const forceFactor = (ANIMATION_CONFIG.MOUSE_INFLUENCE_RADIUS - distMouse) / ANIMATION_CONFIG.MOUSE_INFLUENCE_RADIUS;
        forceX += Math.cos(angle) * forceFactor * this.repulsion;
        forceY += Math.sin(angle) * forceFactor * this.repulsion;
      }
    }

    const dxBase = targetX - this.x;
    const dyBase = targetY - this.y;
    forceX += dxBase * this.returnForce;
    forceY += dyBase * this.returnForce;

    this.vx += forceX;
    this.vy += forceY;

    this.vx *= ANIMATION_CONFIG.FRICTION;
    this.vy *= ANIMATION_CONFIG.FRICTION;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );

    const [r, g, b] = this.color;
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`);
    gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.2)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
