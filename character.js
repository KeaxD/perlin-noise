export class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.speed = 1; // Adjust the speed of the character
  }

  Draw(ctx, radius, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }
}
