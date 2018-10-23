const normalMat = new THREE.ShaderMaterial({
  uniforms: {
    time: {value: 0.0}
  },
  vertexShader: `
    uniform float time;
    varying vec3 vP;
    varying vec3 vN;
    void main() {
      vP = position;
      vN = normal;
      vP.x += sin(vP.x + time);
      vP.y *= 0.5 * cos(vP.y + vP.x + time);
      vec4 modelViewPosition = modelViewMatrix * vec4(vP, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec3 vP;
    varying vec3 vN;
    void main() {
      float r = sin(vP.x + time);
      float g = sin(vP.y + vN.x + time * 2.0);
      float b = cos(vP.z + vN.z + vN.x + time);
      float a = 1.0;//0.5 + 0.5 * sin(vP.x + vP.y + time * 3.0);
      gl_FragColor = vec4(r, g, b, a);
    }
  `
});

export { normalMat };
