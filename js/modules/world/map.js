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
    this.group = new THREE.Group();
    const customMat = (obj) => {
      if (obj.type === 'Mesh') {
        obj.material = this.materials.getCustomMaterial(1, obj.material);
      } else if (obj.children && obj.children.length) {
        obj.children.forEach(child => { conform(child); });
      }
    };

    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(10, 2, 25, 250, 1, 250),
      new THREE.MeshPhysicalMaterial({color: 0xffffff})
    );
    customMat(mesh);
    this.group.add(mesh);
    this.scene.add(this.group);

    // load maps
    /*
    this.loader.loadFBX('map').then((map) => {
      this.group.add(map);
      customMat(map);
      this.scene.add(this.group);
    }, (err) => { console.log(err); });
    */
  }

  update(delta) {
    this.materials.update(delta);
    //this.group.rotation.y += delta * Math.PI / 24;
  }
}

export { Map };
