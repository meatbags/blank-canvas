/**
 * Load lighting.
 **/

import '../../lib/glsl/SkyShader.js';

class Lighting {
  constructor(root) {
    this.scene = root.scene;

    // skybox
    /*
    this.sky = new THREE.Sky();
    this.sky.scale.setScalar(450000);
    const d = 400000;
    const azimuth = 0.25;
    const inclination = 0.4875;
    const theta = Math.PI * (inclination - 0.5);
    const phi = Math.PI * 2 * (azimuth - 0.5);
    const sunPos = new THREE.Vector3(d * Math.cos(phi), d * Math.sin(phi) * Math.sin(theta), d * Math.sin(phi) * Math.cos(theta));
    this.sky.material.uniforms.sunPosition.value.copy(sunPos);
    this.scene.add(this.sky);
    */

    // lighting
    this.lights = {point: {}, ambient: {}, directional: {}, hemisphere: {}};
    //this.lights.ambient.a = new THREE.AmbientLight(0xffffff, 0.125);
    this.lights.hemisphere.a = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.75);

    const size = 10;
    const n = 0;
    for (var i=0; i<n; i++) {
      const key = `L${i}`;
      const colour = Math.random() > 0.66 ? 0xff0000 : Math.random() > 0.5 ? 0x00ff00 : 0x0000ff;
      const light = new THREE.PointLight(colour, 1, size * 2, 2);
      const x = Math.random() * size - size * 0.5;
      const y = Math.random() * size - size * 0.5;
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
