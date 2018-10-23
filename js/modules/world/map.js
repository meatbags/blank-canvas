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

    // spikes
    for (var x=-10; x<10; x+=2) {
      for (var z=-10; z<10; z+=2) {
        const mesh = new THREE.Mesh(
          new THREE.CylinderBufferGeometry(0.25, 0.25, 6, 16),
          new THREE.MeshPhysicalMaterial({color: 0x0})
        );
        this.conformObject(mesh);
        mesh.position.set(x, 0, z);
        this.scene.add(mesh);
      }
    }
  }

  update(delta) {
    this.materials.update(delta);
    //this.objects.forEach(obj => { obj.rotation.y += Math.PI / 48; });
  }
}

export { Map };
