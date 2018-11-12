/**
 * Material manager.
 **/

import * as customMat from './mats';

class Materials {
  constructor(root, path) {
    this.root = root;
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

  applyMaterial(obj) {
    if (obj.type === 'Mesh') {
      this.conformMaterial(obj.material);
      this.root.objects.push(obj);
    } else if (obj.children) {
      for (var i=0, lim=obj.children.length; i<lim; ++i) {
        this.applyMaterial(obj.children[i]);
      }
    }
  }

  applyWireframeMaterial(obj) {
    if (obj.type === 'Mesh') {
      obj.material = this.getCustomMaterial(1, obj.material);
      this.conformWireframeGeometry(obj);
      this.root.objects.push(obj);
    } else if (obj.children) {
      for (var i=0, lim=obj.children.length; i<lim; ++i) {
        const child = obj.children[i];
        this.applyWireframeMaterial(child);
      }
    }
  }

  getCustomMaterial(type, inputMat) {
    const mat = customMat.wireMat.clone();
    mat.extensions.derivatives = true;
    mat.side = THREE.DoubleSide;
    return mat;
    /*
    if (type === undefined || type == 1) {
      const mat = customMat.normalMat.clone();
      mat.uniforms.time = this.uniforms.time;
      return mat;
    } else if (type == 2) {
      //const mat = (inputMat === undefined) ? this.mat.metal.clone() : inputMat.clone();
      const mat = this.mat.metal.clone();
      mat.onBeforeCompile = (shader) => {
        shader.vertexShader = `uniform float time;\n${customMat.perlinNoise}\n${shader.vertexShader}`;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', customMat.metalMat);
        shader.uniforms.time = this.uniforms.time;
      };
      mat.envMap = this.envMap;
      mat.envMapIntensity = 0.125;
      //mat.metalness = 0.25;
      //mat.roughness = 0.25;
      return mat;
    } else {
      return null;
    }
    */
  }

  conformWireframeGeometry(obj) {
    const geo = obj.geometry;
    this.unindexBufferGeometry(geo);
    //geo.toNonIndexed();
    const p = geo.attributes.position;
    const centre = [];
    const remove = 1;
    for (var i=0, lim=p.count/3; i<lim; ++i) {
      if (i%2 == 0) {
        centre.push(0, 0, 1, 0, 1, 0, 1, 0, remove);
      } else {
        centre.push(0, 1, 0, 0, 0, 1, 1, 0, remove);
      }
    }
    geo.addAttribute('centre', new THREE.BufferAttribute(new Float32Array(centre), 3));
  }

  conformMaterial(mat) {
    if (!this.loaded[mat.name]) {
      this.loaded[mat.name] = mat;
    }

    // mat specific
    mat.envMap = this.envMap;
    mat.envMapIntensity = 0.5;

    switch (mat.name) {
      case 'chess':
        mat.normalScale.x = 0.25;
        mat.normalScale.y = 0.25;
        break;
      default:
        break;
    }
  }

  swapVertex(pos, a, b) {
    const cache0 = pos[a];
    const cache1 = pos[a + 1];
    const cache2 = pos[a + 2];
    pos[a] = pos[b];
    pos[a + 1] = pos[b + 1];
    pos[a + 2] = pos[b + 2];
    pos[b] = cache0;
    pos[b + 1] = cache1;
    pos[b + 2] = cache2;
  }

  isVertexEqual(pos, a, b) {
    return (
      pos[a] == pos[b] &&
      pos[a + 1] == pos[b + 1] &&
      pos[a + 2] == pos[b + 2]
    );
  }

  fixQuad(pos, i, j) {
    this.swapVertex(pos, i + 0, i + 3);
    this.swapVertex(pos, j + 3, j + 6);
  }

  isQuad(p, n, i, j) {
    return (
      this.isVertexEqual(n, i, j)
    )
  }

  reverseGeometry(geo) {
    // reverse triangles
    const p = geo.attributes.position.array;
    const n = geo.attributes.normal.array;
    for (var i=0, lim=p.length-9; i<lim; i+=9) {
      const a = i;
      const b = i + 9;
      if (this.isQuad(p, n, a, b)) {
        this.fixQuad(p, a, b);
        this.fixQuad(n, a, b);
      }
    }
  }

  unindexBufferGeometry(bufferGeometry) {
    const index = bufferGeometry.getIndex();
    if (!index) {
      this.reverseGeometry(bufferGeometry);
      return;
    }
    const indexArray = index.array;
    const triangleCount = indexArray.length / 3;
    const attributes = bufferGeometry.attributes;
    const newAttribData = Object.keys(attributes).map(key => {
      return {array: [], attribute: bufferGeometry.getAttribute(key)};
    });

    for (let i = 0; i < triangleCount; i++) {
      const a = indexArray[i * 3 + 0];
      const b = indexArray[i * 3 + 1];
      const c = indexArray[i * 3 + 2];
      const indices = [ a, b, c ];
      newAttribData.forEach(data => {
        const attrib = data.attribute;
        const dim = attrib.itemSize;
        // add [a, b, c] vertices
        for (let i = 0; i < indices.length; i++) {
          const index = indices[i];
          for (let d = 0; d < dim; d++) {
            const v = attrib.array[index * dim + d];
            data.array.push(v);
          }
        }
      });
    }
    index.array = null;
    bufferGeometry.setIndex(null);
    newAttribData.forEach(data => {
      const newArray = new data.attribute.array.constructor(data.array);
      data.attribute.setArray(newArray);
    });
  }

  reset() {
    this.uniforms.time.value = 0;
  }

  update(delta) {
    this.uniforms.time.value += delta;
  }
}

export { Materials };
