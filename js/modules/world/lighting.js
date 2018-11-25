/**
 * Load lighting.
 **/

import '../../lib/glsl/SkyShader.js';

class Lighting {
  constructor(root) {
    this.scene = root.scene;

    // lighting
    this.lights = {point: {}, ambient: {}, directional: {}, hemisphere: {}};
    this.lights.ambient.a = new THREE.AmbientLight(0xffffff, 0.2);
    this.lights.hemisphere.a = new THREE.HemisphereLight(0x0, 0xffffff, 1.0);
    this.lights.point.a = new THREE.PointLight(0xffffff, 1, 10, 0);
    //this.lights.point.a = new THREE.PointLight(0xffffff, 1.0, 20, 1);
    //this.lights.point.a.position.y = 10;

    // placement
    this.lights.point.a.position.set(0, 4, -8);

    const size = 20;
    const n = 0;
    for (var i=0; i<n; i++) {
      const key = `L${i}`;
      const colour = Math.random() > 0.66 ? 0xff0000 : Math.random() > 0.5 ? 0x00ff00 : 0x0000ff;
      //const colour = 0x222222;
      const light = new THREE.PointLight(colour, 1, size * 2, 2);
      const x = Math.random() * size - size * 0.5;
      const y = Math.random() * size * 0.5;
      const z = Math.random() * size - size * 0.5;
      light.position.set(x, y, z);
      this.lights.point[key] = light;
    }

    // add to scene
    Object.keys(this.lights).forEach(type => {
      Object.keys(this.lights[type]).forEach(light => {
        this.scene.add(this.lights[type][light]);
      });
    });
  }
}

export { Lighting };
