const minAngleBetween = function(a1, a2) {
  return Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1));
}

const posterise = function(n, step) {
  return Math.round(n / step) * step;
}

export { minAngleBetween, posterise }
