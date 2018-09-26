/**
 ** Perspective camera.
 **/

class Camera {
  constructor(root) {
    this.root = root;
    //this.angle = 0;
    //this.distance = 5;
    //this.target = new THREE.Vector3();
    this.fov = 65;
    this.aspectRatio = this.root.width / this.root.height;
    this.offset = 1;
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, 0.1, 2000000);
    this.camera.position.set(5, 5, 5);
    //this.camera.up = new THREE.Vector3(0, 1, 0);
    this.controls = new THREE.OrbitControls(this.camera, document.querySelector('#canvas-target'));
    this.controls.enableKeys = true;
    this.controls.enableDamping = true;
    this.controls.update();
    /*
    document.documentElement.addEventListener('mousewheel', (e) => {
      if (e.wheelDelta > 0) {
        this.distance = Math.min(1000, this.distance + 0.5);
      } else {
        this.distance = Math.max(1, this.distance - 0.5);
      }
      this.print();
    })
    this.print();
    */
  }

  print() {
    document.querySelector('#dev-camera').innerHTML = `Camera ${this.distance}`;
  }

  resize(w, h) {
    this.aspectRatio = this.root.width / this.root.height;
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    this.controls.update();
  }
}

export { Camera };
