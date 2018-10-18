/**
 ** Perspective camera.
 **/

class Camera {
  constructor(root) {
    this.root = root;
    this.fov = 65;
    this.aspectRatio = this.root.width / this.root.height;
    this.time = 0;
    this.useOrtho = true;
    if (this.useOrtho) {
      this.orthoHeight = 5;
      this.orthoWidth = this.orthoHeight * this.aspectRatio;
      this.camera = new THREE.OrthographicCamera(-this.orthoWidth, this.orthoWidth, this.orthoHeight, -this.orthoHeight, 0.1, 1000);
      this.camera.position.set(20, 0, 0);
    } else {
      this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, 0.1, 2000000);
      this.camera.position.set(20, 0, 0);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    this.useControls = true;
    if (this.useControls) {
      this.controls = new THREE.OrbitControls(this.camera, document.querySelector('#canvas-target'));
      this.controls.enableKeys = true;
      this.controls.enableDamping = true;
      this.controls.update();
    }
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

  reset() {
    this.time = 0;
  }

  update(delta) {
    this.time += delta;
    if (this.useControls) {
      this.controls.update();
    } else {
      this.camera.position.z = this.time * 5; // -100
    }
  }
}

export { Camera };
