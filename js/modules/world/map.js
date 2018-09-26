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
    this.loadScene();
  }

  loadScene() {
    // main maps
    this.loader.loadFBX('map').then((map) => {
      this.scene.add(map);
      this.conformGroups(map);
    }, (err) => { console.log(err); });

    //const mat = this.materials.getCustomMaterial('warp');
    /*
    const mat = this.materials.mat.metal.clone();
    mat.roughness = 0.3;
    this.group = [];
    for (var x=-15; x<16; ++x) {
      const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.125, 5, 1), mat);
      mesh.position.set(x, 6, 6);
      this.scene.add(mesh);
      this.group.push(mesh);
    }
    */
  }

  conformGroups(obj) {
    // recursively conform object groups
    if (obj.type === 'Mesh') {
      this.materials.conform(obj.material);
    } else if (obj.children && obj.children.length) {
      obj.children.forEach(child => { this.conformGroups(child); });
    }
  }

  update(delta) {
    this.materials.update(delta);
    if (this.group) {
      /*
      if (this.root.player.position.y > 4) {
        const x = this.root.player.position.x;
        this.group.forEach(child => {
          const dist = 1.0 - Math.min(1.0, Math.abs(child.position.x - x) / 12.0);
          const target = 5 + dist * 6;
          const rot = (1 - dist) * Math.PI / 2;
          child.position.y += (target - child.position.y) * 0.04;
          child.rotation.y += (rot - child.rotation.y) * 0.03;
        });
      }
      */
    }
  }
}

export { Map };
