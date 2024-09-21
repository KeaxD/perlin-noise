import * as utils from "./utils.js";

export class Grad {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  dotProduct2D(x, y) {
    return this.x * x + this.y * y;
  }
}

export class PerlinNoise {
  constructor(seed, p, perm, gradP, grad3) {
    this.seed = seed;
    this.p = p;
    this.perm = perm;
    this.gradP = gradP;
    this.grad3 = grad3;
  }

  generateSeed() {
    if (this.seed < 256) {
      this.seed |= this.seed << 8;
    }
    for (var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = this.p[i] ^ (this.seed & 255);
      } else {
        v = this.p[i] ^ ((this.seed >> 8) & 255);
      }
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }

  perlin2d(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x);
    var Y = Math.floor(y);

    // Get relative xy coordinates of point within that cell
    x = x - X;
    y = y - Y;

    // Wrap the integer cells at 255
    X = X & 255;
    Y = Y & 255;

    var n00 = this.gradP[X + this.perm[Y]].dotProduct2D(x, y);
    var n01 = this.gradP[X + this.perm[Y + 1]].dotProduct2D(x, y - 1);
    var n10 = this.gradP[X + 1 + this.perm[Y]].dotProduct2D(x - 1, y);
    var n11 = this.gradP[X + 1 + this.perm[Y + 1]].dotProduct2D(x - 1, y - 1);

    var u = utils.fade(x);

    return utils.lerp(
      utils.lerp(n00, n10, u),
      utils.lerp(n01, n11, u),
      utils.fade(y)
    );
  }
}
