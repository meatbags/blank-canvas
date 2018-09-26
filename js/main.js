/**
 * App entry point.
 **/

import { Scene, Renderer } from './modules';

class App {
  constructor() {
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene);
    this.recordButton = document.querySelector('#record');
    this.recordButton.onclick = () => { this.record(); };
    this.loop();
  }

  record() {
    if (!this.recordButton.classList.contains('active')) {
      this.recordButton.classList.add('active');
      // start
    } else {
      this.recordButton.classList.remove('active');
      // stop, save
    }
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    if (this.active) {
      const t = performance.now();
      const delta = (t - this.now) / 1000;
      this.now = t;
      this.scene.update(delta);
      this.surface.update(delta);
      this.renderer.draw(delta);
      this.surface.draw();
    }
  }
}

window.onload = () => {
  const app = new App();
};
