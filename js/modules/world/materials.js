/**
 * Material manager.
 **/

import * as customMat from './mats';

class Materials {
  constructor(path) {
    this.path = `./${path}/`;
    this.mat = {};
    this.mat.default = new THREE.MeshPhysicalMaterial({emissive: 0, roughness: 1, envMapIntensity: 0.25});
    this.mat.porcelain = new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0x888888, emissiveIntensity: 0.6, roughness: 0.55, metalness: 0.125, envMapIntensity: 0.5});
    this.mat.metal = new THREE.MeshPhysicalMaterial({color: 0xa88e79, emissive: 0x0, roughness: 0.1, metalness: .9, envMapIntensity: 1.0, side: THREE.DoubleSide});

    const envMapSources = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'].map(filename => `${this.path}envmap/${filename}.jpg`);
    this.envMap = new THREE.CubeTextureLoader().load(envMapSources);
    this.normalMap = new THREE.TextureLoader().load(this.path + 'textures/noise.jpg');
    this.normalMap.wrapS = this.normalMap.wrapT = THREE.RepeatWrapping;
    this.normalMap.repeat.set(32, 32);

    //this.mat.metal.map = this.normalMap;

    // set envmaps
    Object.keys(this.mat).forEach(key => {
      if (this.mat[key].type && this.mat[key].type === 'MeshPhysicalMaterial') {
        this.mat[key].envMap = this.envMap;
      }
    });

    // custom shader uniforms
    this.uniforms = {time: {value: 0}};

    // reference file-loaded materials
    this.loaded = {};
  }

  getCustomMaterial(type, inputMat) {
    if (type === undefined || type == 1) {
      const mat = (inputMat === undefined) ? this.mat.metal.clone() : inputMat.clone();
      mat.onBeforeCompile = (shader) => {
        shader.vertexShader = `uniform float time;\n${customMat.perlinNoise}\n${shader.vertexShader}`;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', customMat.metalMat);
        shader.uniforms.time = this.uniforms.time;
      };
      mat.envMap = this.envMap;
      mat.envMapIntensity = 0.5;
      mat.metalness = 0.25;
      mat.roughness = 0.25;
      return mat;
    } else if (type == 2) {
      const mat = customMat.normalMat.clone();
      mat.uniforms.time = this.uniforms.time;
      return mat;
    } else {
      return null;
    }
  }

  conform(mat) {
    if (!this.loaded[mat.name]) {
      this.loaded[mat.name] = mat;
    }

    // mat specific
    mat.envMap = this.envMap;
    mat.envMapIntensity = 0.5;

    switch (mat.name) {
      case 'concrete':
        mat.normalScale.x = 0.25;
        mat.normalScale.y = 0.25;
        break;
      case 'gold':
        break;
      case 'neon':
        mat.emissive = new THREE.Color(1, 1, 1);
        mat.emissiveIntensity = 1.0;
        //mat.fog = false;
        break;
      case 'plastic':
        //mat.emissive = new THREE.Color(1, .95, .95);
        //mat.emissiveIntensity = .75;
        break;
      default:
        break;
    }
  }

  reset() {
    this.uniforms.time.value = 0;
  }

  update(delta) {
    this.uniforms.time.value += delta;
  }
}

export { Materials };
