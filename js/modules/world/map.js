/**
 * Load models.
 **/

import { Materials } from './materials';
import { Loader } from '../loaders';

class Map {
  constructor(root) {
    this.root = root;
    this.scene = root.scene;
    this.materials = new Materials('assets');
    this.loader = new Loader('assets');
    this.age = 0;
    this.loadScene();
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

  loadScene() {
    this.group = new THREE.Group();
    this.objects = [];

    // add centre attribute
    const conformWireframeGeometry = (obj) => {
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
    };

    this.conformObject = (obj) => {
      if (obj.type === 'Mesh') {
        obj.material = this.materials.getCustomMaterial(1, obj.material);
        conformWireframeGeometry(obj);
        this.objects.push(obj);
      } else if (obj.children) {
        for (var i=0, lim=obj.children.length; i<lim; ++i) {
          const child = obj.children[i];
          this.conformObject(child);
        }
      }
    };

    // load map
    this.loader.loadFBX('map').then((map) => {
      this.conformObject(map);
      this.objects.forEach(obj => { this.scene.add(obj); });
    }, (err) => { console.log(err); });

    // auto
    /*
    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.5, 10, 1),
      new THREE.MeshPhysicalMaterial({color: 0x0})
    );
    this.conformObject(mesh);
    this.scene.add(mesh);
    */
  }

  reset() {
    this.objects.forEach(obj => { obj.rotation.set(0, 0, 0); });
  }

  update(delta) {
    this.materials.update(delta);
    this.objects.forEach(obj => { obj.rotation.y += delta * Math.PI / 4; });
  }
}

export { Map };
