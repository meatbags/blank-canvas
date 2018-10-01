/**
 * App entry point.
 **/

import { Scene, Renderer } from './modules';

class App {
  constructor() {
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene);
    this.recordButton = document.querySelector('#record');
    this.frameRate = 48;
    this.framesRecordedTarget = document.querySelector('#frames');
    this.recordButton.onclick = () => { this.record(); };
    this.now = performance.now();
    this.loop();
  }

  record() {
    if (!this.recordButton.classList.contains('active')) {
      this.scene.reset();
      this.framesRecorded = 0;
      this.capturer = new CCapture({framerate: this.frameRate, format: 'png'}); //verbose: true, motionBlurFrames: true
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
      this.framesRecorded += 1;
      const t = Math.floor(this.framesRecorded / this.frameRate * 10) / 10;
      this.framesRecordedTarget.innerHTML = `${t} @ ${this.frameRate}`;
    }
  }
}

window.onload = () => {
  const app = new App();
};
