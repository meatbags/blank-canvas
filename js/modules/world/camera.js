/**
 ** Perspective camera.
 **/

class Camera {
  constructor(root) {
    this.root = root;
    this.position = new THREE.Vector3(10, 10, 10);
    this.target = new THREE.Vector3();
    this.fov = 65;
    this.aspectRatio = this.root.width / this.root.height;
    this.offset = 1;
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, 0.1, 2000000);
    this.camera.up = new THREE.Vector3(0, 1, 0);
  }

  resize(w, h) {
    this.aspectRatio = this.root.width / this.root.height;
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    this.camera.lookAt(this.target);
  }
}

export { Camera };
