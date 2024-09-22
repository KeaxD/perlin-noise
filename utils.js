export function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function lerp(a, b, t) {
  return a + t * (b - a);
}
