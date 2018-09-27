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
    //const mat = ;
    this.group = new THREE.Group();
    const conform = (obj) => {
      if (obj.type === 'Mesh') {
        obj.material = this.materials.getCustomMaterial(1, obj.material);
      } else if (obj.children && obj.children.length) {
        obj.children.forEach(child => { conform(child); });
      }
    };

    // load maps
    this.loader.loadFBX('map').then((map) => {
      this.group.add(map);
      conform(map);
      this.scene.add(this.group);
    }, (err) => { console.log(err); });
  }

  update(delta) {
    this.materials.update(delta);
    this.group.rotation.y += delta * Math.PI / 24;
  }
}

export { Map };
