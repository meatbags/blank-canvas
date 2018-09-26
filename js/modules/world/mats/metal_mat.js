// uniform float time

const metalMat = `
  vec3 p = position;
  vec3 n = vNormal;
  float t = time * 2.0;
  //p.x += 0.25 * sin(n.x + p.z + t) + n.x * 1.0;
  p.y += cos(time + p.x);
  p.z += 0.25 * sin(t + n.y) + n.y * 2.0;
  vec3 transformed = p;

  //float theta = sin((p.x + p.z + p.y) + t);
  //float c = cos(theta);
  //float s = sin(theta);
  vec3 pn = vNormal + normalize(p - position);
  vNormal = normalize(vec3(pn.x / 2.0, pn.y / 2.0, pn.z / 2.0));
`;

export { metalMat };
