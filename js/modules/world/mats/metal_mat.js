// uniform float time

const metalMat = `
  // position
  vec3 p = position;
  vec3 n = vNormal;
  float t = time * 2.0;
  p.x += 0.25 * sin(p.z + t);
  p.y += cos(time + p.x);
  p.z += 0.25 * sin(t + p.y);
  vec3 transformed = p;

  // normal
  vec3 pn = vNormal + normalize(p - position);
  vNormal = normalize(vec3(pn.x / 2.0, pn.y / 2.0, pn.z / 2.0));
`;

export { metalMat };
