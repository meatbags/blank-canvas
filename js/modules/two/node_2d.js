/**
 ** 2d draw node.
 **/

class Node2d {
  constructor(root) {
    this.root = root;
    this.x = Math.random() * root.cvs.width;
    this.y = Math.random() * root.cvs.height;
    this.vector = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1
    };
    this.speed = 20 + Math.random() * 20;
    const mag = Math.hypot(this.vector.x, this.vector.y);
    if (mag != 0) {
      this.vector.x /= mag;
      this.vector.y /= mag;
    }
  }

  update(delta) {
    this.x += this.vector.x * this.speed * delta;
    this.y += this.vector.y * this.speed * delta;
    if (this.x < 0 || this.x > this.root.cvs.width) {
      this.vector.x *= -1;
    }
    if (this.y < 0 || this.y > this.root.cvs.height) {
      this.vector.y *= -1;
    }
  }

  draw(ctx) {
    const snap = 4;
    const x = Math.floor(this.x / snap) * snap;
    const y = Math.floor(this.y / snap) * snap;
    ctx.beginPath();
    ctx.fillRect(x, y, 1, 1);
  }
}

export { Node2d };
