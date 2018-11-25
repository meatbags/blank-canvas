/**
 * Load models.
 **/

import { Materials } from './materials';
import { Loader } from '../loaders';
import { Chess } from './chessboard';

class Map {
  constructor(root) {
    this.root = root;
    this.scene = root.scene;
    this.materials = new Materials(this, 'assets');
    this.loader = new Loader('assets');
    //this.chess = new Chess(this);
    this.age = 0;
    this.tick = 0;
    this.loadScene();
  }

  loadScene() {
    this.group = new THREE.Group();
    this.objects = [];

    this.loader.loadFBX('ring').then((map) => {
      this.materials.applyMaterial(map);
      this.objects.forEach(obj => {
        obj.material.side = THREE.DoubleSide;
        this.scene.add(obj);
      });
    }, (err) => { console.log(err); });

    // load map
    /*
    this.loader.loadFBX('chess').then((map) => {
      this.materials.applyMaterial(map);
      this.chess.init(map);
    }, (err) => { console.log(err); });
    */
  }

  reset() {
    this.tick = 0;
    this.age = 0;
    this.objects.forEach(obj => { obj.rotation.set(0, 0, 0); });
    if (this.chess) {
      this.chess.reset(true);
    }
  }

  update(delta) {
    if (this.chess) {
      this.chess.update(delta);
    }
    this.materials.update(delta);
    this.objects.forEach(obj => {
      obj.rotation.x = (this.tick / 48) * Math.PI;
      //obj.rotation.z = Math.sin(this.age / 2 * Math.PI * 2) * Math.PI / 7;
      //obj.position.y = -15 + (this.age * 6 % 50);
      //obj.rotation.y += Math.PI * delta;
    });
    this.tick += 1;
    this.age += delta;
  }
}

export { Map };
