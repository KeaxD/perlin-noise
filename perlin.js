export default class PerlinNoise {
  constructor() {
    this.permutation = this.generatePermutation();
    this.gradients = this.generateGradients();
  }

  generatePermutation() {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // Shuffle the array
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    return p.concat(p); // Duplicate the array
  }

  generateGradients() {
    const gradients = [];
    for (let i = 0; i < 256; i++) {
      const angle = Math.random() * Math.PI * 2;
      gradients[i] = [Math.cos(angle), Math.sin(angle)];
    }
    return gradients;
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  dotGridGradient(ix, iy, x, y) {
    const gradient =
      this.gradients[this.permutation[ix + this.permutation[iy % 256]] % 256];
    const dx = x - ix;
    const dy = y - iy;
    return dx * gradient[0] + dy * gradient[1];
  }

  perlin(x, y) {
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;

    const sx = this.fade(x - x0);
    const sy = this.fade(y - y0);

    const n0 = this.dotGridGradient(x0, y0, x, y);
    const n1 = this.dotGridGradient(x1, y0, x, y);
    const ix0 = this.lerp(n0, n1, sx);

    const n0y = this.dotGridGradient(x0, y1, x, y);
    const n1y = this.dotGridGradient(x1, y1, x, y);
    const ix1 = this.lerp(n0y, n1y, sx);

    return this.lerp(ix0, ix1, sy);
  }

  lerp(a, b, t) {
    return a + t * (b - a);
  }

  colorMapping(value) {
    if (value < 100) {
      return { r: 0, g: 0, b: 104 };
    }
    if (value < 130) {
      return { r: 0, g: 0, b: 205 };
    }
    if (value < 145) {
      return { r: 0, g: 158, b: 0 };
    }
    if (value < 160) {
      return { r: 0, g: 120, b: 0 };
    } else {
      return { r: 0, g: 98, b: 0 };
    }
  }
}
