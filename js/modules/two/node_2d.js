/**
 ** 2d draw node.
 **/

import * as MathFunc from './maths';

class Node2d {
  constructor(root) {
    this.root = root;
    this.index = root.nodes.length;
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
    const snap = 32;
    const x1 = MathFunc.posterise(this.x, snap);
    const y1 = MathFunc.posterise(this.y, snap);
    const rad = 4;
    ctx.fillRect(x1 - rad/2, y1 - rad/2, rad, rad);
    //ctx.beginPath();
    //ctx.arc(x1, y1, rad, 0, Math.PI*2, false);
    //ctx.fill();
    const threshold = 60;
    this.root.nodes.forEach(node => {
      if (node.index != this.index) {
        const x2 = MathFunc.posterise(node.x, snap);
        const y2 = MathFunc.posterise(node.y, snap);
        const mag = Math.hypot(x1 - x2, y1 - y2);
        const angle = Math.round(Math.abs(Math.atan2(y2 - y1, x2 - x1)) * (180 / Math.PI));
        if (mag < threshold && angle % 5 < 3) {
          //ctx.globalAlpha = 1 - mag / threshold;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    });
    ctx.globalAlpha = 1;
  }
}

export { Node2d };
