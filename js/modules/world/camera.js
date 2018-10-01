/**
 ** Perspective camera.
 **/

class Camera {
  constructor(root) {
    this.root = root;
    this.fov = 65;
    this.aspectRatio = this.root.width / this.root.height;
    this.useOrtho = true;
    if (this.useOrtho) {
      this.orthoHeight = 5;
      this.orthoWidth = this.orthoHeight * this.aspectRatio;
      this.camera = new THREE.OrthographicCamera(-this.orthoWidth, this.orthoWidth, this.orthoHeight, -this.orthoHeight, 0.1, 1000);
      this.camera.position.set(20, 0, 0);
    } else {
      this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, 0.1, 2000000);
      this.camera.position.set(10, 0, 10);
    }
    this.controls = new THREE.OrbitControls(this.camera, document.querySelector('#canvas-target'));
    this.controls.enableKeys = true;
    this.controls.enableDamping = true;
    this.controls.update();
  }

  print() {
    document.querySelector('#dev-camera').innerHTML = `Camera ${this.distance}`;
  }

  resize(w, h) {
    this.aspectRatio = this.root.width / this.root.height;
    if (this.camera.isOrthographicCamera) {
      this.orthoWidth = this.orthoHeight * this.aspectRatio;
      this.camera.left = -this.orthoWidth;
      this.camera.right = this.orthoWidth;
      this.camera.top = this.orthoHeight;
      this.camera.bottom = -this.orthoHeight;
      this.camera.updateProjectionMatrix();
    } else {
      this.camera.aspect = this.aspectRatio;
      this.camera.updateProjectionMatrix();
    }
  }

  update(delta) {
    this.controls.update();
  }
}

export { Camera };
