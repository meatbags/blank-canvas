/**
 * Webgl renderer.
 **/

import '../lib/glsl';

class Renderer {
  constructor(scene) {
    this.scene = scene.scene;
    this.camera = scene.camera.camera;
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.renderer.setClearColor(0x0, 0);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.setSize();

    //this.renderer.localClippingEnabled = true;
    this.renderer.clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    ];

    // render passes
    const strength = 0.5;
    const radius = 0.125;
    const threshold = 0.96;
    this.passRender = new THREE.RenderPass(this.scene, this.camera);
    //this.passPoster = new THREE.PosterPass(this.size);
    //this.passBloom = new THREE.UnrealBloomPass(this.size, strength, radius, threshold);
    //this.passBloom.renderToScreen = true;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(this.passRender);
    this.passRender.renderToScreen = true;
    //this.composer.addPass(this.passPoster);
    //this.composer.addPass(this.passBloom);

    // events, doc
    window.addEventListener('resize', () => { this.resize(); });
    this.domElement = document.querySelector('#canvas-target');
    this.domElement.append(this.renderer.domElement);
    this.resize();
    scene.resize();
  }

  setSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (!this.size) {
      this.size = new THREE.Vector2(this.width, this.height);
    } else {
      this.size.x = this.width;
      this.size.y = this.height;
    }
  }

  resize() {
    this.setSize();
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
    //this.passBloom.setSize(this.width, this.height);
  }

  draw(delta) {
    this.composer.render(delta);
  }
}

export { Renderer };
