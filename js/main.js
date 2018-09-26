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
    this.now = performance.now();
    this.loop();
  }

  record() {
    if (!this.recordButton.classList.contains('active')) {
      this.capturer = new CCapture({framerate: 24, motionBlurFrames: true, format: 'png'}); //verbose: true
      this.capturer.start();
      this.recording = true;
      this.recordButton.classList.add('active');
    } else {
      this.recording = false;
      this.capturer.stop();
      this.capturer.save();
      this.recordButton.classList.remove('active');
    }
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });

    // render
    const t = performance.now();
    const delta = (t - this.now) / 1000;
    this.now = t;
    this.scene.update(delta);
    this.renderer.draw(delta);

    // record video
    if (this.recording) {
      this.capturer.capture(this.renderer.renderer.domElement);
    }
  }
}

window.onload = () => {
  const app = new App();
};
