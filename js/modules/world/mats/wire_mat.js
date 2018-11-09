const wireMat = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: `
    attribute vec3 centre;
    varying vec3 vC;

    void main() {
      vC = centre;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vC;

    float edgeFactorTri() {
      vec3 d = fwidth(vC.xyz);
      vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vC.xyz);
      return min(min(a3.x, a3.y), a3.z);
    }

    void main() {
      gl_FragColor.rgb = mix(vec3(1.0), vec3(0.2), edgeFactorTri());
      gl_FragColor.a = 1.0;
    }
  `
});

export { wireMat };
