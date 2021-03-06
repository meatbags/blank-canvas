/**
 ** Two-dimensional canvas.
 **/

import { Node2d } from './node_2d';

class Scene2d {
  constructor() {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = 200;
    this.cvs.height = 200;
    this.cvs.style.background = 'black';
    this.cvs.style.bottom = 0;
    this.cvs.style.right = 0;
    this.cvs.style.top = 'auto';
    this.cvs.style.left = 'auto';
    this.reset();
    document.querySelector('#canvas-target').appendChild(this.cvs);
  }

  reset() {
    this.nodes = [];
    for (var i=0, lim=100; i<lim; ++i) {
      this.nodes.push(new Node2d(this));
    }
  }

  update(delta) {
    this.nodes.forEach(node => {
      node.update(delta);
    });
  }

  draw(delta) {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.fillStyle = this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 4;
    //this.ctx.setLineDash([4, 8]);
    //this.ctx.globalCompositeOperation = 'xor';
    this.nodes.forEach(node => {
      node.draw(this.ctx);
    });
  }
}

export { Scene2d };
