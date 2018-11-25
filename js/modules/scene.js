/**
 * 3D scene handler.
 **/

import { Camera, Lighting, Map } from './world';

class Scene {
  constructor() {
    this.element = document.querySelector('#canvas-target');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.lighting = new Lighting(this);
    this.map = new Map(this);

    // events
    window.addEventListener('resize', () => { this.resize(); });
  }

  reset() {
    this.map.reset();
    this.map.materials.reset();
    this.camera.reset();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.resize();
  }

  update(delta) {
    this.camera.update(delta);
    this.map.update(delta);
  }
}

export { Scene };
