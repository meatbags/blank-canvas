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

    const wire = new THREE.MeshPhysicalMaterial({metalness: 1, color: 0x0, emissive: 0x00ff00, wireframe: true});
    this.objects = [];

    this.conformObject = (obj) => {
      if (obj.type === 'Mesh') {
        //obj.material = wire;
        obj.material = this.materials.getCustomMaterial(1, obj.material);
        this.objects.push(obj);
      } else if (obj.children) {
        for (var i=0, lim=obj.children.length; i<lim; ++i) {
          const child = obj.children[i];
          this.conformObject(child);
        }
      }
    };

    // load maps
    this.loader.loadFBX('map').then((map) => {
      this.conformObject(map);
      this.objects.forEach(obj => { this.scene.add(obj); });
    }, (err) => { console.log(err); });
  }

  update(delta) {
    this.materials.update(delta);
    //this.objects.forEach(obj => { obj.rotation.y += Math.PI / 48; });
  }
}

export { Map };
