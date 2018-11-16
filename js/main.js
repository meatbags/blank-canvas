/**
 * App entry point.
 **/

import { Scene, Renderer, Scene2d } from './modules';

class App {
  constructor() {
    // 3d canvas
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene);

    // 2d canvas
    this.scene2d = new Scene2d();

    // set recording target
    this.recordingTargetCanvas = this.renderer.renderer.domElement;//this.scene2d.cvs;

    // recording interface
    this.recordButton = document.querySelector('#record');
    this.resetButton = document.querySelector('#dev-reset');
    this.resetButton.onclick = () => { this.scene.reset(); };
    this.frameRate = 60;
    this.framesRecordedTarget = document.querySelector('#frames');
    this.recordButton.onclick = () => { this.record(); };

    // run
    this.now = performance.now();
    this.loop();
  }

  record() {
    if (!this.recordButton.classList.contains('active')) {
      // seed scene
      Math.seedrandom(0x1337);

      // reset scenes
      this.scene.reset();
      this.scene2d.reset();

      // set recording flags
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

    // render 3d
    const t = performance.now();
    const delta = (t - this.now) / 1000;
    this.now = t;
    this.scene.update(delta);
    this.renderer.draw(delta);

    // render 2d
    //this.scene2d.update(delta);
    //this.scene2d.draw(delta);

    // record video
    if (this.recording) {
      this.capturer.capture(this.recordingTargetCanvas);
      this.framesRecorded += 1;
      const t = Math.floor(this.framesRecorded / this.frameRate * 10) / 10;
      this.framesRecordedTarget.innerHTML = `${t} @ ${this.frameRate}fps`;
    }
  }
}

window.onload = () => {
  const app = new App();
};
