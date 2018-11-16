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
    this.loadScene();
  }

  loadScene() {
    this.group = new THREE.Group();
    this.objects = [];

    this.loader.loadFBX('hand').then((map) => {
      this.materials.applyMaterial(map);
      this.objects.forEach(obj => { this.scene.add(obj); });
    }, (err) => { console.log(err); });
    // load map
    /*
    this.loader.loadFBX('map').then((map) => {
      this.materials.applyMaterial(map);
      this.chess.init(map);
      //this.objects.forEach(obj => { this.scene.add(obj); });
    }, (err) => { console.log(err); });
    */
  }

  reset() {
    //this.objects.forEach(obj => { obj.rotation.set(0, 0, 0); });
    //this.chess.reset(true);
  }

  update(delta) {
    //this.chess.update(delta);
    this.materials.update(delta);
    this.objects.forEach(obj => { obj.rotation.y += delta * Math.PI / 4; });
  }
}

export { Map };
